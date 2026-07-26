"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import ChatUI from "@/components/ChatUI";
import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { Loader2, Lock, MessageCircle, ArrowRight } from "lucide-react";

export default function ChatPage() {
  const [status, setStatus] = useState<
    "loading" | "unauthenticated" | "free" | "active"
  >("loading");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { lang } = useLanguage();

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStatus("unauthenticated");
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .single();

      if (data?.membership_status === "active") {
        setStatus("active");
      } else {
        setStatus("free");
      }
      setIsLoading(false);
    };

    check();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-md py-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <MessageCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-900">
            {t("chat.signInTitle", lang)}
          </h2>
          <p className="mb-6 text-sm text-slate-500">
            {t("chat.signInDesc", lang)}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md"
          >
            {t("chat.signInButton", lang)}
            <ArrowRight className={`h-4 w-4 ${lang === "ar" ? "rtl-flip" : ""}`} />
          </Link>
        </div>
      </div>
    );
  }

  if (status === "free") {
    return (
      <div className="mx-auto max-w-md py-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-900">
            {t("chat.premiumTitle", lang)}
          </h2>
          <p className="mb-6 text-sm text-slate-500">
            {t("chat.premiumDesc", lang)}
          </p>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md"
          >
            {t("chat.upgradeButton", lang)}
            <ArrowRight className={`h-4 w-4 ${lang === "ar" ? "rtl-flip" : ""}`} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          {t("chat.pageTitle", lang)}
        </h1>
        <p className="mt-1 text-slate-500">
          {t("chat.pageSubtitle", lang)}
        </p>
      </div>
      <ChatUI />
    </div>
  );
}
