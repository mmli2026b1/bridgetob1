"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { topics, TopicContent, getTopicBySlug } from "@/lib/content";
import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import { Send, Bot, User, Sparkles, RefreshCw, Mic, MicOff, Volume2, Square, Headphones } from "lucide-react";

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
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const voiceModeRef = useRef(false); // avoids stale closures in callbacks
  const cachedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const finalizeRef = useRef<(() => void) | null>(null);
  const { lang } = useLanguage();

  const topic = getTopicBySlug(selectedTopic);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  // Check for Web Speech API support on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition && "speechSynthesis" in window);
  }, []);

  // Load and cache the best available voice (voices load async in some browsers)
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const pickBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;

      const priorityPatterns = [
        /Google UK English Female/i,
        /Google UK English Male/i,
        /Microsoft.*Online.*Natural/i,
        /Microsoft.*Neural/i,
        /Natural/i,
      ];

      let best: SpeechSynthesisVoice | undefined;
      for (const pattern of priorityPatterns) {
        best = voices.find((v) => pattern.test(v.name) && v.lang.startsWith("en"));
        if (best) break;
      }
      if (!best) best = voices.find((v) => v.lang === "en-GB");
      if (!best) best = voices.find((v) => v.lang.startsWith("en"));

      cachedVoiceRef.current = best || null;
    };

    pickBestVoice();
    window.speechSynthesis.onvoiceschanged = pickBestVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

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

  // Strip Markdown formatting so speech doesn't read out ** and other symbols
  const stripMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")   // **bold**
      .replace(/\*(.*?)\*/g, "$1")        // *italic*
      .replace(/`(.*?)`/g, "$1")          // `code`
      .replace(/#{1,6}\s?/g, "")          // # headings
      .replace(/^\s*[-•]\s?/gm, "")       // bullet points
      .replace(/\n{2,}/g, ". ")           // paragraph breaks → pause
      .replace(/\n/g, " ")                // remaining line breaks
      .trim();
  };

  // ─── Text-to-speech (playback of AI messages) ───────────────────
  const speakMessage = useCallback((text: string, index: number, onDone?: () => void) => {
    if (!("speechSynthesis" in window)) {
      onDone?.();
      return;
    }

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = stripMarkdown(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-GB";
    utterance.rate = 0.98;
    utterance.pitch = 1;

    if (cachedVoiceRef.current) {
      utterance.voice = cachedVoiceRef.current;
    }

    utterance.onend = () => {
      setSpeakingIndex(null);
      onDone?.();
    };
    utterance.onerror = () => {
      setSpeakingIndex(null);
      onDone?.();
    };

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  }, [speakingIndex]);

  // ─── Send message (used by both manual send and voice auto-send) ─
  const sendMessage = useCallback(async (overrideText?: string) => {
    const textToSend = overrideText ?? input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLiveTranscript("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          message: textToSend,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `❌ ${data.error}` },
        ]);
      } else {
        setMessages((prev) => {
          const newMessages = [...prev, { role: "assistant" as const, content: data.reply }];
          const newIndex = newMessages.length - 1;
          // Auto-speak the AI reply if Voice Mode is active
          if (voiceModeRef.current) {
            setTimeout(() => {
              speakMessage(data.reply, newIndex, () => {
                // After AI finishes speaking, wait a beat, then start listening again
                if (voiceModeRef.current) {
                  setTimeout(() => startListening(), 1200);
                }
              });
            }, 200);
          }
          return newMessages;
        });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, loading, selectedTopic, lang, speakMessage]);

  // ─── Speech-to-text (microphone input) ──────────────────────────
  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    let finalTranscript = "";
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;
    let intentionalStop = false;

    const resetSilenceTimer = (recognition: any) => {
      if (silenceTimer) clearTimeout(silenceTimer);
      // Wait 6 seconds of real silence before treating the user as "done"
      silenceTimer = setTimeout(() => {
        intentionalStop = true;
        recognition.stop();
      }, 6000);
    };

    const createRecognition = () => {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "ar" ? "ar-SA" : "en-GB";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interim += transcript;
          }
        }
        resetSilenceTimer(recognition);
        // Always show live preview so the user can see what's being captured
        setLiveTranscript(finalTranscript + interim);
        if (!voiceModeRef.current) {
          setInput(finalTranscript + interim);
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error === "no-speech" || e.error === "aborted") return; // ignore, will auto-restart via onend
        setIsRecording(false);
        if (silenceTimer) clearTimeout(silenceTimer);
      };

      recognition.onend = () => {
        if (intentionalStop) {
          // Real end — user actually paused long enough, or manually stopped
          setIsRecording(false);
          if (silenceTimer) clearTimeout(silenceTimer);
          const finalText = finalTranscript.trim();
          setLiveTranscript("");
          if (finalText) {
            if (voiceModeRef.current) {
              sendMessage(finalText);
            } else {
              setInput(finalText);
            }
          }
        } else {
          // Browser stopped it prematurely — restart seamlessly, keep listening
          recognitionRef.current = createRecognition();
          recognitionRef.current.start();
        }
      };

      return recognition;
    };

    // Let the manual "tap mic to stop" button trigger an immediate finalize
    finalizeRef.current = () => {
      intentionalStop = true;
      if (silenceTimer) clearTimeout(silenceTimer);
      recognitionRef.current?.stop();
    };

    recognitionRef.current = createRecognition();
    recognitionRef.current.start();
    setIsRecording(true);
    setLiveTranscript("");
    resetSilenceTimer(recognitionRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, sendMessage]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      // Manual stop — finalize and send immediately, no waiting for the timer
      finalizeRef.current?.();
      return;
    }
    startListening();
  }, [isRecording, startListening]);

  const toggleVoiceMode = () => {
    const next = !voiceMode;
    setVoiceMode(next);
    voiceModeRef.current = next;
    if (!next) {
      // Turning voice mode off — stop anything in progress
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
      setIsRecording(false);
      setLiveTranscript("");
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
        if (voiceModeRef.current) {
          setTimeout(() => {
            speakMessage(data.reply, 0, () => {
              if (voiceModeRef.current) {
                setTimeout(() => startListening(), 1200);
              }
            });
          }, 200);
        }
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
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            <button
              onClick={startNewSession}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              {t("chatui.newSession", lang)}
            </button>
            {speechSupported && (
              <button
                onClick={toggleVoiceMode}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  voiceMode
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Headphones className="h-4 w-4" />
                {voiceMode ? "Voice Mode: ON" : "Voice Mode: OFF"}
              </button>
            )}
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

        {voiceMode && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <Headphones className="h-4 w-4 shrink-0" />
            <span>
              Voice Mode is on — tap the mic to start speaking. Tap it again when you're done, or pause for 6 seconds and it'll send automatically.
            </span>
          </div>
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
                    className={`group relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {msg.content}
                    {msg.role === "assistant" && speechSupported && (
                      <button
                        onClick={() => speakMessage(msg.content, i)}
                        className="ml-2 mt-2 inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-xs font-medium text-slate-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-white hover:text-emerald-600"
                        title="Listen"
                      >
                        {speakingIndex === i ? (
                          <>
                            <Square className="h-3 w-3" /> Stop
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3 w-3" /> Listen
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {/* Live transcript preview while recording */}
              {isRecording && (
                <div className="flex items-start gap-3 flex-row-reverse">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-400">
                    <Mic className="h-4 w-4" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 px-4 py-3 text-sm leading-relaxed text-slate-500">
                    {liveTranscript || "Listening…"}
                  </div>
                </div>
              )}
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
              placeholder={voiceMode ? "Voice Mode active — tap the mic to speak" : t("chatui.placeholder", lang)}
              rows={2}
              disabled={voiceMode}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            />
          </div>
          {speechSupported && (
            <button
              onClick={toggleRecording}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-all ${
                isRecording
                  ? "animate-pulse bg-red-500 text-white hover:bg-red-400"
                  : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
              title={isRecording ? "Tap to finish and send" : "Speak your answer"}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          )}
          {!voiceMode && (
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          )}
        </div>

        {isRecording && (
          <div className="mt-2 flex items-center gap-2 text-xs text-red-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Listening… take your time. Tap the mic again when you're done.
          </div>
        )}

        {speakingIndex !== null && (
          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-500">
            <Volume2 className="h-3 w-3 animate-pulse" />
            AI is speaking…
          </div>
        )}

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