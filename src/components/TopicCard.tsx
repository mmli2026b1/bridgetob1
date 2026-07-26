import Link from "next/link";
import { TopicContent } from "@/lib/content";
import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";

type Props = {
  topic: TopicContent;
  isPaid?: boolean;
  isUnlocked?: boolean;
};

export default function TopicCard({ topic, isPaid, isUnlocked }: Props) {
  const { lang } = useLanguage();
  const isFree = !isPaid;
  const canAccess = isFree || isUnlocked;

  return (
    <Link
      href={canAccess ? `/topics/${topic.slug}` : "#"}
      className={`group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md ${
        !canAccess ? "cursor-default opacity-70" : "hover:-translate-y-0.5"
      }`}
    >
      {/* Badge */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-3xl">{topic.emoji}</span>
        {isFree ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {t("topicCard.free", lang)}
          </span>
        ) : !isUnlocked ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {t("topicCard.premium", lang)}
          </span>
        ) : (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {t("topicCard.unlocked", lang)}
          </span>
        )}
      </div>

      <h3 className="mb-2 text-lg font-bold text-slate-900">{topic.title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-slate-500">
        {topic.description}
      </p>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
        {topic.vocabulary && (
          <span className="flex items-center gap-1">
            📝 {topic.vocabulary.length} {t("topicCard.words", lang)}
          </span>
        )}
        {topic.modelQAs && (
          <span className="flex items-center gap-1">
            💬 {topic.modelQAs.length} {t("topicCard.qas", lang)}
          </span>
        )}
        {topic.usefulPhrases && (
          <span className="flex items-center gap-1">
            ✨ {topic.usefulPhrases.length} {t("topicCard.phrases", lang)}
          </span>
        )}
      </div>

      {/* Blur overlay for locked topics */}
      {!canAccess && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/40 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🔒</span>
            <span className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500">
              {t("topicCard.upgradeToUnlock", lang)}
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}
