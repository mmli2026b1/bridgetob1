"use client";

import { useState, useRef, useEffect } from "react";
import { topics, TopicContent, getTopicBySlug } from "@/lib/content";
import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import { Send, Bot, User, Sparkles, RefreshCw } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatUI() {
  const [selectedTopic, setSelectedTopic] = useState<string>("family");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();

  const topic = getTopicBySlug(selectedTopic);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history when topic changes
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/tutor-chat?topic=${selectedTopic}&history=true`);
        const data = await res.json();
        if (data.messages) {
          setMessages(
            data.messages.map((m: any) => ({
              role: m.role,
              content: m.content,
            }))
          );
        }
        if (data.remaining !== undefined) {
          setRemaining(data.remaining);
        }
      } catch {
        // Not loaded yet, that's fine
      }
    };
    loadHistory();
  }, [selectedTopic]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          message: input,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `❌ ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        if (data.remaining !== undefined) {
          setRemaining(data.remaining);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chatui.error", lang) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startNewSession = async () => {
    setMessages([]);
    setLoading(true);
    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          message: "start",
          reset: true,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([{ role: "assistant", content: data.reply }]);
      }
      if (data.remaining !== undefined) {
        setRemaining(data.remaining);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 lg:flex-row">
      {/* Sidebar — topic selector */}
      <div className="lg:w-72">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-slate-900">
            {t("chatui.selectTopic", lang)}
          </h3>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {topics.map((tp) => (
              <button
                key={tp.slug}
                onClick={() => setSelectedTopic(tp.slug)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  selectedTopic === tp.slug
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{tp.emoji}</span>
                <span>{tp.title}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <button
              onClick={startNewSession}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              {t("chatui.newSession", lang)}
            </button>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-slate-900">
              AI Tutor — {topic?.title ?? selectedTopic}
            </h2>
          </div>
          {remaining !== null && (
            <span className="text-xs text-slate-400">
              {remaining} {t("chatui.messagesRemaining", lang)}
            </span>
          )}
        </div>

        {topic && (
          <p className="mb-4 text-sm text-slate-400">
            {t("chatui.practicing", lang)}{" "}
            <span className="font-medium text-slate-600">{topic.title}</span>
            {topic.description && ` — ${topic.description}`}
          </p>
        )}

        {/* Messages */}
        <div className="mb-4 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm min-h-[400px] max-h-[500px]">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Sparkles className="mx-auto mb-3 h-10 w-10 text-emerald-300" />
                <p className="text-sm text-slate-400">
                  {t("chatui.emptyState", lang)}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "user"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-violet-100 text-violet-600"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("chatui.placeholder", lang)}
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {loading && (
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <RefreshCw className="h-3 w-3 animate-spin" />
            {t("chatui.thinking", lang)}
          </div>
        )}
      </div>
    </div>
  );
}
