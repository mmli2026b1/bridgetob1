"use client";

import { TopicContent } from "@/lib/content";
import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import { BookOpen, MessageCircle, Sparkles, Lightbulb } from "lucide-react";
import TranslatableWord from "@/components/TranslatableWord";

type Props = {
  topic: TopicContent;
};

export default function TopicPage({ topic }: Props) {
  const { lang } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{topic.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {topic.title}
            </h1>
            {topic.chapter && (
              <p className="text-sm font-medium text-emerald-600">
                {topic.chapter}
              </p>
            )}
          </div>
        </div>
        <p className="text-lg leading-relaxed text-slate-500">
          {topic.description}
        </p>
      </div>

      {/* Form fields / Key Questions */}
      {topic.formFields && topic.formFields.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">
              {t("topic.keyQuestions", lang)}
            </h2>
          </div>
          <ul className="space-y-3">
            {topic.formFields.map((field, i) => (
              <li key={i} className="rounded-xl bg-white p-4 shadow-sm">
                <p className="font-medium text-slate-900">{field.label}</p>
                {field.hint && (
                  <p className="mt-1 text-sm text-slate-400">
                    💡 {field.hint}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Vocabulary */}
      {topic.vocabulary && topic.vocabulary.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-bold text-slate-900">
              {t("topic.keyVocabulary", lang)}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {topic.vocabulary.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <p className="font-bold text-emerald-700">
                  <TranslatableWord text={item.word} translation={item.wordAr} />
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  <TranslatableWord text={item.definition} translation={item.definitionAr} />
                </p>
                {item.example && (
                  <p className="mt-2 italic text-slate-400 text-sm">
                    &ldquo;{item.example}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Model Q&As */}
      {topic.modelQAs && topic.modelQAs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-violet-500" />
            <h2 className="text-xl font-bold text-slate-900">
              {t("topic.modelQas", lang)}
            </h2>
          </div>
          <div className="space-y-5">
            {topic.modelQAs.map((qa, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-start gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                    Q
                  </span>
                  <p className="font-medium text-slate-900">{qa.question}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    A
                  </span>
                  <p className="leading-relaxed text-slate-600">{qa.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Useful Phrases */}
      {(topic.usefulPhrases && topic.usefulPhrases.length > 0) && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            <h2 className="text-xl font-bold text-slate-900">
              {t("topic.usefulPhrases", lang)}
            </h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-pink-50 to-white p-6">
            <ul className="space-y-2">
              {topic.usefulPhrases.map((phrase, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 text-pink-400">✪</span>
                  <span className="text-slate-700">{phrase}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Tips */}
      {topic.tips && topic.tips.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900">{t("topic.tips", lang)}</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-6">
            <ul className="space-y-3">
              {topic.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                    {i + 1}
                  </span>
                  <span className="text-slate-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}