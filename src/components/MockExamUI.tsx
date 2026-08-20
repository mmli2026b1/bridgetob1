"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getTopicBySlug } from "@/lib/content";
import { Send, Bot, User, RefreshCw, GraduationCap, FileText, Mic, MicOff, Headphones, Volume2 } from "lucide-react";

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

  // Voice state
  const [voiceMode, setVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const voiceModeRef = useRef(false);
  const cachedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const finalizeRef = useRef<(() => void) | null>(null);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, report]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition && "speechSynthesis" in window);
  }, []);

  // Load and cache the best available voice
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

  const stripMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/#{1,6}\s?/g, "")
      .replace(/^\s*[-•]\s?/gm, "")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, " ")
      .trim();
  };

  // ─── Text-to-speech ──────────────────────────────────────────
  const speakMessage = useCallback((text: string, onDone?: () => void) => {
    if (!("speechSynthesis" in window)) {
      onDone?.();
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = stripMarkdown(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-GB";
    utterance.rate = 0.98;
    utterance.pitch = 1;
    if (cachedVoiceRef.current) utterance.voice = cachedVoiceRef.current;

    utterance.onend = () => {
      setIsSpeaking(false);
      onDone?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onDone?.();
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

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
            history: messagesRef.current,
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
    []
  );

  // ─── Speech-to-text ──────────────────────────────────────────
  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    let finalTranscript = "";
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;
    let intentionalStop = false;

    const resetSilenceTimer = (recognition: any) => {
      if (silenceTimer) clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        intentionalStop = true;
        recognition.stop();
      }, 6000);
    };

    const createRecognition = () => {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-GB";
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
        setLiveTranscript(finalTranscript + interim);
        if (!voiceModeRef.current) {
          setInput(finalTranscript + interim);
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error === "no-speech" || e.error === "aborted") return;
        setIsRecording(false);
        if (silenceTimer) clearTimeout(silenceTimer);
      };

      recognition.onend = () => {
        if (intentionalStop) {
          setIsRecording(false);
          if (silenceTimer) clearTimeout(silenceTimer);
          const finalText = finalTranscript.trim();
          setLiveTranscript("");
          if (finalText) {
            if (voiceModeRef.current) {
              submitAnswer(finalText);
            } else {
              setInput(finalText);
            }
          }
        } else {
          recognitionRef.current = createRecognition();
          recognitionRef.current.start();
        }
      };

      return recognition;
    };

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
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
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
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
      setIsRecording(false);
      setLiveTranscript("");
    }
  };

  // ─── Exam flow ──────────────────────────────────────────────
  const startExam = async (topicSlug: string) => {
    setPart1Topic(topicSlug);
    const p2 = pickPart2Topics();
    setPart2Topics(p2);
    setMessages([]);
    messagesRef.current = [];
    setTurnCount(0);
    setStage("part1");

    const reply = await callApi("start", null, { p1: topicSlug });
    if (reply) {
      setMessages([{ role: "assistant", content: reply }]);
      if (voiceModeRef.current) {
        setTimeout(() => {
          speakMessage(reply, () => {
            if (voiceModeRef.current) setTimeout(() => startListening(), 1200);
          });
        }, 200);
      }
    }
  };

  const submitAnswer = async (answerText: string) => {
    if (!answerText.trim() || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: answerText }]);

    const nextTurn = turnCount + 1;
    setTurnCount(nextTurn);

    let apiStage = "";
    const ctx: { p1?: string; p2a?: string; p2b?: string } = {
      p1: part1Topic ?? undefined,
      p2a: part2Topics[0],
      p2b: part2Topics[1],
    };

    if (stage === "part1") {
      if (nextTurn >= PART1_TURNS) apiStage = "transition-to-part2";
      else if (nextTurn === PART1_TURNS - 1) apiStage = "part1-final";
      else apiStage = "part1";
    } else if (stage === "part2a") {
      const localTurn = nextTurn - PART1_TURNS;
      apiStage = localTurn >= PART2_TURNS_PER_TOPIC ? "transition-to-part2b" : "part2a";
    } else if (stage === "part2b") {
      const localTurn = nextTurn - PART1_TURNS - PART2_TURNS_PER_TOPIC;
      apiStage = localTurn >= PART2_TURNS_PER_TOPIC ? "closing" : "part2b";
    } else if (stage === "closing") {
      apiStage = "report";
    }

    const reply = await callApi(apiStage, answerText, ctx);
    if (!reply) return;

    if (apiStage === "report") {
      setReport(reply);
      setStage("done");
      window.speechSynthesis?.cancel();
      return;
    }

    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

    if (apiStage === "transition-to-part2") setStage("part2a");
    else if (apiStage === "transition-to-part2b") setStage("part2b");
    else if (apiStage === "closing") setStage("closing");

    if (voiceModeRef.current) {
      setTimeout(() => {
        speakMessage(reply, () => {
          if (voiceModeRef.current) setTimeout(() => startListening(), 1200);
        });
      }, 200);
    }
  };

  const sendAnswer = () => submitAnswer(input);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendAnswer();
    }
  };

  const restart = () => {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();
    setStage("select-topic");
    setPart1Topic(null);
    setPart2Topics([]);
    setMessages([]);
    messagesRef.current = [];
    setTurnCount(0);
    setReport(null);
    setIsRecording(false);
    setLiveTranscript("");
  };

  // ─── Render: report screen ──────────────────────────────────
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

  // ─── Render: topic selection screen ─────────────────────────
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

        {speechSupported && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Headphones className="h-4 w-4 text-emerald-600" />
              Practice by speaking instead of typing
            </div>
            <button
              onClick={toggleVoiceMode}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                voiceMode
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {voiceMode ? "Voice Mode: ON" : "Voice Mode: OFF"}
            </button>
          </div>
        )}

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

  // ─── Render: exam in progress ────────────────────────────────
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

      {voiceMode && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Headphones className="h-4 w-4 shrink-0" />
          <span>Voice Mode is on — tap the mic to answer. Tap again when you're done, or pause for 6 seconds.</span>
        </div>
      )}

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
      </div>

      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={voiceMode ? "Voice Mode active — tap the mic to speak" : "Type your answer…"}
          rows={2}
          disabled={voiceMode}
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        />
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
            onClick={sendAnswer}
            disabled={loading || !input.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition-all hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
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

      {isSpeaking && (
        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-500">
          <Volume2 className="h-3 w-3 animate-pulse" />
          Examiner is speaking…
        </div>
      )}

      {loading && (
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
          <RefreshCw className="h-3 w-3 animate-spin" />
          The examiner is responding…
        </div>
      )}
    </div>
  );
}