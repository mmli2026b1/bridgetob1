"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import { User, LogOut, BookOpen, MessageCircle, Globe } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { lang, toggleLang, isRtl } = useLanguage();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 transition-colors hover:text-emerald-600"
        >
          <BookOpen className="h-6 w-6 text-emerald-500" />
          <span>{t("header.logo", lang)}</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            {t("header.home", lang)}
          </Link>
          <Link
            href="/topics/family"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            {t("header.topics", lang)}
          </Link>
          {user && (
            <Link
              href="/chat"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <MessageCircle className="h-4 w-4" />
              {t("header.aiTutor", lang)}
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className={`flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition-all hover:bg-slate-100 ${
              isRtl ? "text-emerald-700" : "text-slate-600"
            }`}
            title={t("language.switchLabel", lang)}
          >
            <Globe className={`h-4 w-4 ${isRtl ? "rtl-flip" : ""}`} />
            <span>{t("language.switchToArabic", lang)}</span>
          </button>

          {/* Auth buttons */}
          {loading ? (
            <div className={`h-8 w-20 animate-pulse rounded-lg bg-slate-200 ${isRtl ? "mr-2" : "ml-2"}`} />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{t("header.account", lang)}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t("header.signOut", lang)}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {t("header.signIn", lang)}
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md"
              >
                {t("header.getStarted", lang)}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav links */}
      <div className="flex border-t border-slate-100 px-4 py-2 sm:hidden">
        <Link
          href="/"
          className="flex-1 text-center text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          {t("header.home", lang)}
        </Link>
        <Link
          href="/topics/family"
          className="flex-1 text-center text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          {t("header.topics", lang)}
        </Link>
        {user && (
          <Link
            href="/chat"
            className="flex-1 text-center text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            {t("header.aiTutor", lang)}
          </Link>
        )}
      </div>
    </header>
  );
}
