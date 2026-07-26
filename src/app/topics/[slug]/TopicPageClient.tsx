"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { TopicContent } from "@/lib/content";
import TopicPage from "@/components/TopicPage";
import PaymentGate from "@/components/PaymentGate";
import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  topic: TopicContent;
};

export default function TopicPageClient({ topic }: Props) {
  const [membershipStatus, setMembershipStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { lang } = useLanguage();

  const isFree = topic.chapter === undefined;

  useEffect(() => {
    const checkMembership = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMembershipStatus("free");
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .single();

      setMembershipStatus(data?.membership_status ?? "free");
      setLoading(false);
    };

    checkMembership();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const isUnlocked = isFree || membershipStatus === "active";

  return (
    <div>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className={`h-4 w-4 ${lang === "ar" ? "rtl-flip" : ""}`} />
        {t("topic.backToHome", lang)}
      </Link>

      {isUnlocked ? (
        <TopicPage topic={topic} />
      ) : (
        <PaymentGate topicTitle={topic.title}>
          <TopicPage topic={topic} />
        </PaymentGate>
      )}
    </div>
  );
}
