import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCurrentUser, createAdminClient } from "@/lib/supabaseServer";
import { getTopicBySlug, TopicContent } from "@/lib/content";

// ─── Rate limit config ───────────────────────────────────────────
const DAILY_MESSAGE_LIMIT = 30;

// ─── Anthropic client ────────────────────────────────────────────
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
let anthropic: Anthropic | null = null;
if (anthropicApiKey) {
  anthropic = new Anthropic({ apiKey: anthropicApiKey });
}

// ─── Build the system prompt with topic context ──────────────────
function buildSystemPrompt(topic: TopicContent): string {
  const vocabSection = topic.vocabulary
    ? topic.vocabulary
        .map((v) => `- "${v.word}": ${v.definition}${v.example ? ` (e.g., "${v.example}")` : ""}`)
        .join("\n")
    : "No specific vocabulary for this topic.";

  const modelQASection = topic.modelQAs
    ? topic.modelQAs
        .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
        .join("\n\n")
    : "No model Q&As provided.";

  const phrasesSection = topic.usefulPhrases
    ? topic.usefulPhrases.join("\n")
    : "No useful phrases provided.";

  return `You are a friendly and encouraging B1 English Speaking Exam coach. You are helping the student practice for their B1 exam (or UK Citizenship English test).

TOPIC: ${topic.title}
TOPIC DESCRIPTION: ${topic.description}

KEY VOCABULARY FOR THIS TOPIC:
${vocabSection}

MODEL QUESTIONS AND ANSWERS:
${modelQASection}

USEFUL PHRASES:
${phrasesSection}

RULES:
1. Start a session by asking ONE practice question related to the topic.
2. After the student answers, give brief feedback using this structure:
   - "Yes" or "Not quite" (was their answer suitable for B1 level?)
   - A short reason why.
   - One small example or suggestion to improve.
3. Keep your feedback encouraging and supportive. Use phrases like "Great effort!", "Good try!", "That's a solid answer!"
4. Then ask another follow-up question to keep the conversation going.
5. If the student asks for help, give them a model answer or vocabulary suggestion.
6. Keep responses concise — aim for 3-5 sentences per turn.
7. Never answer for the student — prompt them to speak.`;
}

// ─── Rate limit helpers ──────────────────────────────────────────
async function getDailyMessageCount(
  supabase: any,
  userId: string
): Promise<number> {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("daily_message_counts")
    .select("count")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  return data?.count ?? 0;
}

async function incrementMessageCount(supabase: any, userId: string) {
  const today = new Date().toISOString().split("T")[0];

  // Use the database function which handles insert-or-increment atomically
  await supabase.rpc("increment_message_count", {
    p_user_id: userId,
    p_date: today,
  });
}

// ─── History ──────────────────────────────────────────────────────
async function getChatHistory(supabase: any, userId: string, topic: string) {
  const { data } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("user_id", userId)
    .eq("topic", topic)
    .order("created_at", { ascending: true })
    .limit(20);

  return data ?? [];
}

async function saveMessage(
  supabase: any,
  userId: string,
  topic: string,
  role: "user" | "assistant",
  content: string
) {
  await supabase.from("chat_messages").insert({
    user_id: userId,
    topic,
    role,
    content,
  });
}

// ─── GET: fetch history and remaining count ──────────────────────
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const topicSlug = searchParams.get("topic") ?? "family";
    const topic = getTopicBySlug(topicSlug);

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const supabase = createAdminClient();
    const messages = await getChatHistory(supabase, user.id, topicSlug);
    const dailyCount = await getDailyMessageCount(supabase, user.id);
    const remaining = Math.max(0, DAILY_MESSAGE_LIMIT - dailyCount);

    return NextResponse.json({ messages, remaining });
  } catch (error: any) {
    console.error("GET tutor-chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST: send a message and get Claude's reply ────────────────
export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to use the AI tutor." },
        { status: 401 }
      );
    }

    // 2. Membership check (server-side — not just UI hiding!)
    const supabase = createAdminClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_status")
      .eq("id", user.id)
      .single();

    if (profile?.membership_status !== "active") {
      return NextResponse.json(
        { error: "Premium membership required for AI tutor." },
        { status: 403 }
      );
    }

    // 3. Parse request
    const { topic: topicSlug, message, reset } = await request.json();

    const topic = getTopicBySlug(topicSlug ?? "family");
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // 4. Rate limit check
    const dailyCount = await getDailyMessageCount(supabase, user.id);
    const remaining = Math.max(0, DAILY_MESSAGE_LIMIT - dailyCount);

    if (dailyCount >= DAILY_MESSAGE_LIMIT) {
      return NextResponse.json(
        {
          error: `You've reached your daily limit of ${DAILY_MESSAGE_LIMIT} messages. Upgrade or try again tomorrow.`,
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // 5. Anthropic check
    if (!anthropic) {
      return NextResponse.json(
        {
          error:
            "AI tutor is not configured. Please add your ANTHROPIC_API_KEY to .env.local.",
          remaining,
        },
        { status: 500 }
      );
    }

    // 6. Build history and get reply
    const systemPrompt = buildSystemPrompt(topic);
    const history = await getChatHistory(supabase, user.id, topicSlug);

    const messages: Anthropic.Messages.MessageParam[] = history.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    if (reset || message === "start") {
      // Start a fresh session — ask a practice question
      const msg = await anthropic.messages.create({
        model: "claude-sonnet-5",
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Start a new practice session for the topic "${topic.title}". Ask me one practice question.`,
          },
        ],
      });

      const reply =
        (msg.content.find((c: any) => c.type === "text") as any)?.text ?? "";

      // Save assistant message
      await saveMessage(supabase, user.id, topicSlug, "assistant", reply);
      await incrementMessageCount(supabase, user.id);

      return NextResponse.json({
        reply,
        remaining: Math.max(0, DAILY_MESSAGE_LIMIT - dailyCount - 1),
      });
    }

    // 7. Save user message
    await saveMessage(supabase, user.id, topicSlug, "user", message);
    messages.push({ role: "user", content: message });

    // 8. Get Claude's response
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 500,
      system: systemPrompt,
      messages,
    });

    const reply = (msg.content.find((c: any) => c.type === "text") as any)?.text ?? "";

    // 9. Save assistant reply
    await saveMessage(supabase, user.id, topicSlug, "assistant", reply);
    await incrementMessageCount(supabase, user.id);

    return NextResponse.json({
      reply,
      remaining: Math.max(0, DAILY_MESSAGE_LIMIT - dailyCount - 1),
    });
  } catch (error: any) {
    console.error("Tutor chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
