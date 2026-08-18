"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getTopicBySlug } from "@/lib/content";
import { Send, Bot, User, RefreshCw, GraduationCap, FileText } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const PART1_SLUGS = ["family", "job", "hobbies", "travel", "my-country"];
const PART2_POOL = [
  "transport",
  "entertainment",
  "special-occasions",
  "means-of-transport",
  "music",
  "recent-experiences",
  "festivals",
];

const PART1_TURNS = 4;
const PART2_TURNS_PER_TOPIC = 3;

type Stage =
  | "select-topic"
  | "part1"
  | "part2a"
  | "part2b"
  | "closing"
  | "report"
  | "done";

export default function MockExamUI() {
  const [stage, setStage] = useState<Stage>("select-topic");
  const [part1Topic, setPart1Topic] = useState<string | null>(null);
  const [part2Topics, setPart2Topics] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, report]);

  const pickPart2Topics = () => {
    const shuffled = [...PART2_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  };

  const callApi = useCallback(
    async (stageName: string, userMessage: string | null, ctx: { p1?: string; p2a?: string; p2b?: string }) => {
      setLoading(true);
      try {
        const res = await fetch("/api/mock-exam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stage: stageName,
            part1Topic: ctx.p1,
            part2TopicA: ctx.p2a,
            part2TopicB: ctx.p2b,
            history: messages,
            userMessage,
          }),
        });
        const data = await res.json();
        if (data.error) {
          setMessages((prev) => [...prev, { role: "assistant", content: `❌ ${data.error}` }]);
          setLoading(false);
          return null;
        }
        if (data.remaining !== undefined) setRemaining(data.remaining);
        return data.reply as string;
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  const startExam = async (topicSlug: string) => {
    setPart1Topic(topicSlug);
    const p2 = pickPart2Topics();
    setPart2Topics(p2);
    setMessages([]);
    setTurnCount(0);
    setStage("part1");

    const reply = await callApi("start", null, { p1: topicSlug });
    if (reply) setMessages([{ role: "assistant", content: reply }]);
  };

  const sendAnswer = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);

    const nextTurn = turnCount + 1;
    setTurnCount(nextTurn);

    let apiStage = "";
    const ctx: { p1?: string; p2a?: string; p2b?: string } = {
      p1: part1Topic ?? undefined,
      p2a: part2Topics[0],
      p2b: part2Topics[1],
    };

    if (stage === "part1") {
      if (nextTurn >= PART1_TURNS) {
        apiStage = "transition-to-part2";
      } else if (nextTurn === PART1_TURNS - 1) {
        apiStage = "part1-final";
      } else {
        apiStage = "part1";
      }
    } else if (stage === "part2a") {
      const localTurn = nextTurn - PART1_TURNS;
      if (localTurn >= PART2_TURNS_PER_TOPIC) {
        apiStage = "transition-to-part2b";
      } else {
        apiStage = "part2a";
      }
    } else if (stage === "part2b") {
      const localTurn = nextTurn - PART1_TURNS - PART2_TURNS_PER_TOPIC;
      if (localTurn >= PART2_TURNS_PER_TOPIC) {
        apiStage = "closing";
      } else {
        apiStage = "part2b";
      }
    } else if (stage === "closing") {
      apiStage = "report";
    }

    const reply = await callApi(apiStage, userText, ctx);
    if (!reply) return;

    if (apiStage === "report") {
      setReport(reply);
      setStage("done");
      return;
    }

    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

    if (apiStage === "transition-to-part2") setStage("part2a");
    else if (apiStage === "transition-to-part2b") setStage("part2b");
    else if (apiStage === "closing") setStage("closing");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendAnswer();
    }
  };

  const restart = () => {
    setStage("select-topic");
    setPart1Topic(null);
    setPart2Topics([]);
    setMessages([]);
    setTurnCount(0);
    setReport(null);
  };

  if (stage === "done" && report) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <FileText className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-900">Your Mock Exam Report</h1>
        </div>
        <div className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-700 shadow-sm">
          {report}
        </div>
        <button
          onClick={restart}
          className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-500"
        >
          <RefreshCw className="h-4 w-4" />
          Start a New Mock Exam
        </button>
      </div>
    );
  }

  if (stage === "select-topic") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <GraduationCap className="h-7 w-7 text-emerald-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">B1 Mock Speaking Exam</h1>
            <p className="text-sm text-slate-500">
              A realistic, timed-style mock exam — Part 1 (your topic) and Part 2 (conversation). No corrections during the exam; you'll get a full report at the end.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-slate-900">Choose your Part 1 topic:</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PART1_SLUGS.map((slug) => {
              const topic = getTopicBySlug(slug);
              if (!topic) return null;
              return (
                <button
                  key={slug}
                  onClick={() => startExam(slug)}
                  disabled={loading}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50"
                >
                  <span className="text-2xl">{topic.emoji}</span>
                  <span className="font-medium text-slate-800">{topic.title}</span>
                </button>
              );
            })}
          </div>
          {loading && (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Starting your exam…
            </div>
          )}
        </div>
      </div>
    );
  }

  const stageLabel =
    stage === "part1"
      ? "Part 1 — Your Topic"
      : stage === "part2a"
      ? `Part 2 — ${getTopicBySlug(part2Topics[0])?.title ?? ""}`
      : stage === "part2b"
      ? `Part 2 — ${getTopicBySlug(part2Topics[1])?.title ?? ""}`
      : stage === "closing"
      ? "Closing — Ask the Examiner"
      : "Exam";

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">{stageLabel}</h2>
        </div>
        {remaining !== null && (
          <span className="text-xs text-slate-400">{remaining} messages remaining today</span>
        )}
      </div>

      <div className="mb-4 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm min-h-[400px] max-h-[500px]">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user" ? "bg-emerald-100 text-emerald-600" : "bg-violet-100 text-violet-600"
                }`}
              >
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer…"
          rows={2}
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
        <button
          onClick={sendAnswer}
          disabled={loading || !input.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition-all hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      {loading && (
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
          <RefreshCw className="h-3 w-3 animate-spin" />
          The examiner is responding…
        </div>
      )}
    </div>
  );
}