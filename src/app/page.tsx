"use client";

import Link from "next/link";
import { topics, getFreeTopics } from "@/lib/content";
import TopicCard from "@/components/TopicCard";
import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import {
  BookOpen,
  MessageCircle,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Headphones,
  Download,
} from "lucide-react";

export default function HomePage() {
  const freeTopics = getFreeTopics();
  const { lang } = useLanguage();

  return (
    <div className="space-y-20">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 px-6 py-16 text-white shadow-xl sm:px-12 sm:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            {t("hero.badge", lang)}
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {t("hero.title1", lang)}{" "}
            <span className="text-emerald-200">{t("hero.title2", lang)}</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-emerald-100">
            {t("hero.subtitle", lang)}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/topics/family"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 hover:shadow-lg"
            >
              {t("hero.tryFree", lang)}
              <ArrowRight className={`h-5 w-5 ${lang === "ar" ? "rtl-flip" : ""}`} />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-white/10"
            >
              {t("hero.getFullAccess", lang)}
              <BookOpen className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Audio Sample ─────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Headphones className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {t("audio.title", lang)}
                </h2>
                <p className="text-sm text-emerald-100">
                  {t("audio.subtitle", lang)}
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-6">
            <div className="rounded-xl bg-slate-50 p-4">
              <audio
                controls
                className="w-full"
                preload="metadata"
              >
                <source src="/audio/Success-B1-Audio.mp4" type="audio/mp4" />
                <source src="/audio/Success-B1-Audio.mp4" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <p className="mt-3 text-center text-xs text-slate-400">
                {t("audio.caption", lang)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Download the Full Ebook ─────────────────────────── */}
      <section className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
          <div className={`grid gap-8 p-8 sm:p-12 ${lang === "ar" ? "" : "sm:grid-cols-2"}`}>
            <div>
              <div className="mb-4 inline-flex rounded-xl bg-amber-100 p-3 text-amber-600">
                <Download className="h-6 w-6" />
              </div>
              <h2 className="mb-3 text-2xl font-extrabold text-slate-900">
                {t("ebook.title", lang)}
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                {t("ebook.description", lang)}
              </p>
              <ul className="mb-6 space-y-2">
                {[
                  t("ebook.feature1", lang),
                  t("ebook.feature2", lang),
                  t("ebook.feature3", lang),
                  t("ebook.feature4", lang),
                  t("ebook.feature5", lang),
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  £9.99
                </span>
                <span className="text-sm text-slate-400 line-through">
                  £14.99
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100">
                <Download className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="mb-2 text-center text-lg font-bold text-slate-900">
                {t("ebook.oneTimeTitle", lang)}
              </h3>
              <p className="mb-6 text-center text-sm text-slate-500">
                {t("ebook.oneTimeDesc", lang)}
              </p>
              <Link
                href="/signup"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition-all hover:bg-amber-500 hover:shadow-md"
              >
                {t("ebook.buyCta", lang)}
                <Download className="h-5 w-5" />
              </Link>
              <p className="mt-3 text-xs text-slate-400">
                {t("ebook.signupNote", lang)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">
          {t("features.title", lang)}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: t("features.12Topics", lang),
              desc: t("features.12TopicsDesc", lang),
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              icon: MessageCircle,
              title: t("features.aiTutor", lang),
              desc: t("features.aiTutorDesc", lang),
              color: "text-violet-500",
              bg: "bg-violet-50",
            },
            {
              icon: Sparkles,
              title: t("features.grammar", lang),
              desc: t("features.grammarDesc", lang),
              color: "text-pink-500",
              bg: "bg-pink-50",
            },
            {
              icon: CheckCircle,
              title: t("features.modelAnswers", lang),
              desc: t("features.modelAnswersDesc", lang),
              color: "text-emerald-500",
              bg: "bg-emerald-50",
            },
            {
              icon: Headphones,
              title: t("features.audio", lang),
              desc: t("features.audioDesc", lang),
              color: "text-amber-500",
              bg: "bg-amber-50",
            },
            {
              icon: Download,
              title: t("features.ebook", lang),
              desc: t("features.ebookDesc", lang),
              color: "text-orange-500",
              bg: "bg-orange-50",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`mb-4 inline-flex rounded-xl ${feature.bg} p-3 ${feature.color}`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Free Preview ─────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            {t("freePreview.title", lang)}
          </h2>
          <p className="mt-2 text-slate-500">
            {t("freePreview.subtitle", lang)}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {freeTopics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </section>

      {/* ─── Premium Topics Preview ───────────────────────────── */}
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            {t("premium.title", lang)}
          </h2>
          <p className="mt-2 text-slate-500">
            {t("premium.subtitle", lang)}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics
            .filter((t) => t.chapter !== undefined)
            .slice(0, 6)
            .map((topic) => (
              <TopicCard key={topic.slug} topic={topic} isPaid={true} />
            ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md"
          >
            {t("premium.cta", lang)}
            <ArrowRight className={`h-5 w-5 ${lang === "ar" ? "rtl-flip" : ""}`} />
          </Link>
        </div>
      </section>
    </div>
  );
}
