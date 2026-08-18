import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getCurrentUser, createAdminClient } from "@/lib/supabaseServer";
import { getTopicBySlug, TopicContent } from "@/lib/content";

const DAILY_MESSAGE_LIMIT = 30;

const openaiApiKey = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;
if (openaiApiKey) {
  openai = new OpenAI({ apiKey: openaiApiKey });
}

const MODEL = "gpt-4o-mini";

function topicContext(slug: string): string {
  const topic = getTopicBySlug(slug);
  if (!topic) return "";

  const vocab = topic.vocabulary
    ? topic.vocabulary.map((v) => `- "${v.word}": ${v.definition}`).join("\n")
    : "";
  const qas = topic.modelQAs
    ? topic.modelQAs.map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`).join("\n\n")
    : "";
  const phrases = topic.usefulPhrases ? topic.usefulPhrases.join("\n") : "";

  return `TOPIC: ${topic.title}\nDESCRIPTION: ${topic.description}\n\nRELEVANT VOCABULARY:\n${vocab}\n\nMODEL Q&A FOR REFERENCE:\n${qas}\n\nUSEFUL PHRASES:\n${phrases}`;
}

const EXAM_RULES = `You are acting as a professional Trinity GESE Grade 5 (B1) speaking examiner conducting a realistic mock oral exam.

STRICT RULES DURING THE EXAM:
- Do NOT correct the candidate's grammar or mistakes.
- Do NOT teach or explain anything.
- Do NOT give model answers or help formulate answers.
- Do NOT reveal any score or evaluation until the exam is over.
- Ask only ONE question at a time.
- Keep the tone natural, professional, and realistic — like a real examiner.
- Do not reward memorised-sounding answers; encourage natural, personal communication.
- Keep each of your turns brief (1-3 sentences) — just the question or a short natural acknowledgement, not feedback.`;

function buildStageSystemPrompt(
  stage: string,
  context: { part1Topic?: string; part2TopicA?: string; part2TopicB?: string }
): string {
  switch (stage) {
    case "start":
      return `${EXAM_RULES}\n\n${topicContext(context.part1Topic!)}\n\nThis is PART 1 of the exam. Greet the candidate briefly and warmly, then ask them to introduce their chosen topic ("${getTopicBySlug(context.part1Topic!)?.title}"). Ask one open opening question to get them started.`;
    case "part1":
      return `${EXAM_RULES}\n\n${topicContext(context.part1Topic!)}\n\nThis is PART 1 of the exam (personal topic: ${getTopicBySlug(context.part1Topic!)?.title}). Ask ONE natural follow-up question based on the candidate's previous answer. Test their ability to give reasons, examples, opinions, comparisons, and talk about past/future.`;
    case "part1-final":
      return `${EXAM_RULES}\n\n${topicContext(context.part1Topic!)}\n\nThis is the LAST question of PART 1. Ask one final natural follow-up question, then in your NEXT turn (after their answer) you will transition to Part 2 — but for now, just ask this one question.`;
    case "transition-to-part2":
      return `${EXAM_RULES}\n\n${topicContext(context.part2TopicA!)}\n\nPart 1 has just finished. Briefly and naturally tell the candidate you will now move to Part 2, the conversation section. Then ask your first question about the topic "${getTopicBySlug(context.part2TopicA!)?.title}".`;
    case "part2a":
      return `${EXAM_RULES}\n\n${topicContext(context.part2TopicA!)}\n\nThis is PART 2 of the exam, discussing "${getTopicBySlug(context.part2TopicA!)?.title}". Ask ONE natural follow-up question based on their previous answer.`;
    case "transition-to-part2b":
      return `${EXAM_RULES}\n\n${topicContext(context.part2TopicB!)}\n\nNaturally transition to a new topic in the conversation. Ask your first question about "${getTopicBySlug(context.part2TopicB!)?.title}".`;
    case "part2b":
      return `${EXAM_RULES}\n\n${topicContext(context.part2TopicB!)}\n\nThis is PART 2 of the exam, discussing "${getTopicBySlug(context.part2TopicB!)?.title}". Ask ONE natural follow-up question based on their previous answer.`;
    case "closing":
      return `${EXAM_RULES}\n\nThe conversation topics are now finished. Trinity GESE format requires the candidate to ask the examiner at least one question. Politely invite the candidate to ask you a question now (e.g. "Now it's your turn — is there anything you'd like to ask me?"). If they already asked a question in their last message, answer it briefly and naturally, then let them know the exam is complete and thank them.`;
    case "report":
      return `The mock exam has now ended. You are no longer an examiner speaking to the candidate — you are now producing a written training assessment report based on the entire conversation above.

Provide the report in this exact structure, using clear markdown-style headers:

**Overall Result:** (Strong / Pass / Borderline / Needs Improvement)

**Training Score (out of 100):**
- Communication: /25
- Fluency: /20
- Grammar: /20
- Vocabulary: /15
- Answer Development: /10
- Interaction: /10
- Total: /100

**Strongest Skills:**
(list)

**Weakest Skills:**
(list)

**Top 5 Mistakes & Corrections:**
(list, with brief corrections)

**Grammar & Vocabulary Weaknesses:**
(short paragraph)

**Fluency & Interaction Notes:**
(short paragraph)

**Use of Rescue Strategies:**
(comment on whether they used rescue phrases like "let me think" when needed)

**Did they ask the examiner a question?**
(yes/no, and comment)

**Three Improvement Priorities:**
1.
2.
3.

Finish with this exact line: "Note: this is a training assessment, not an official Trinity score."`;
    default:
      return EXAM_RULES;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to use the mock exam." }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_status")
      .eq("id", user.id)
      .single();

    if (profile?.membership_status !== "active") {
      return NextResponse.json({ error: "Premium membership required for the mock exam." }, { status: 403 });
    }

    const today = new Date().toISOString().split("T")[0];
    const { data: countRow } = await supabase
      .from("daily_message_counts")
      .select("count")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();
    const dailyCount = countRow?.count ?? 0;
    const remaining = Math.max(0, DAILY_MESSAGE_LIMIT - dailyCount);

    if (dailyCount >= DAILY_MESSAGE_LIMIT) {
      return NextResponse.json(
        { error: `You've reached your daily limit of ${DAILY_MESSAGE_LIMIT} messages. Try again tomorrow.`, remaining: 0 },
        { status: 429 }
      );
    }

    if (!openai) {
      return NextResponse.json(
        { error: "AI is not configured. Please add your OPENAI_API_KEY to .env.local.", remaining },
        { status: 500 }
      );
    }

    const { stage, part1Topic, part2TopicA, part2TopicB, history, userMessage } = await request.json();

    const systemPrompt = buildStageSystemPrompt(stage, { part1Topic, part2TopicA, part2TopicB });

    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...(history ?? []).map((m: any) => ({ role: m.role, content: m.content })),
    ];

    if (userMessage) {
      chatMessages.push({ role: "user", content: userMessage });
    } else {
      chatMessages.push({ role: "user", content: "(Begin this stage now.)" });
    }

    const completion = await openai.chat.completions.create({
      model: MODEL,
      max_tokens: stage === "report" ? 900 : 300,
      messages: chatMessages,
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    await supabase.rpc("increment_message_count", { p_user_id: user.id, p_date: today });

    return NextResponse.json({ reply, remaining: Math.max(0, remaining - 1) });
  } catch (error: any) {
    console.error("Mock exam error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}