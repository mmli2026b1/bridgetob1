"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import {
  User,
  CreditCard,
  Shield,
  ArrowRight,
  Loader2,
  Download,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

type Profile = {
  email: string;
  membership_status: "free" | "active" | "cancelled";
  ebook_purchased: boolean;
};

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [ebookLoading, setEbookLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { lang } = useLanguage();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      // Fetch profile
      const { data } = await supabase
        .from("profiles")
        .select("email, membership_status, ebook_purchased")
        .eq("id", user.id)
        .single();

      setProfile(
        data || {
          email: user.email ?? "",
          membership_status: "free" as const,
          ebook_purchased: false,
        }
      );
      setLoading(false);
    };

    load();
  }, []);

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { url, error } = await res.json();
      if (error) {
        toast.error(error);
        setUpgradeLoading(false);
        return;
      }
      window.location.href = url;
    } catch {
      toast.error(t("account.error", lang));
      setUpgradeLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { url, error } = await res.json();
      if (error) {
        toast.error(error);
        setPortalLoading(false);
        return;
      }
      window.location.href = url;
    } catch {
      toast.error(t("account.error", lang));
      setPortalLoading(false);
    }
  };

  const handleBuyEbook = async () => {
    setEbookLoading(true);
    try {
      const res = await fetch("/api/create-ebook-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { url, error } = await res.json();
      if (error) {
        toast.error(error);
        setEbookLoading(false);
        return;
      }
      window.location.href = url;
    } catch {
      toast.error(t("account.error", lang));
      setEbookLoading(false);
    }
  };

  const handleDownloadEbook = async () => {
    try {
      const res = await fetch("/api/download-ebook");
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error || t("account.error", lang));
        return;
      }

      // Trigger file download from the response blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Success-Bridge-B1-Ebook.docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(t("account.downloadStarted", lang));
    } catch {
      toast.error(t("account.error", lang));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {t("account.premiumActive", lang)}
          </span>
        );
      case "cancelled":
        return (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {t("account.cancelled", lang)}
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {t("account.free", lang)}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">
        {t("account.title", lang)}
      </h1>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t("account.profile", lang)}
              </h2>
              <p className="text-sm text-slate-500">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Membership Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t("account.membership", lang)}
                </h2>
              </div>
            </div>
            {profile && getStatusBadge(profile.membership_status)}
          </div>

          <div className="mt-4 space-y-3">
            {profile?.membership_status === "active" ? (
              <>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm text-emerald-800">
                    {t("account.premiumActiveDesc", lang)}
                  </p>
                </div>
                <button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {portalLoading
                    ? t("account.loading", lang)
                    : t("account.manageSubscription", lang)}
                  <ArrowRight className={`h-4 w-4 ${lang === "ar" ? "rtl-flip" : ""}`} />
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-500">
                  {t("account.freePlanDesc", lang)}
                </p>
                <button
                  onClick={handleUpgrade}
                  disabled={upgradeLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {upgradeLoading
                    ? t("account.loading", lang)
                    : t("account.upgradeCta", lang)}
                  <ArrowRight className={`h-4 w-4 ${lang === "ar" ? "rtl-flip" : ""}`} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Ebook Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t("account.ebookTitle", lang)}
                </h2>
              </div>
            </div>
            {profile?.ebook_purchased ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {t("account.ebookPurchased", lang)}
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                {t("account.ebookNotPurchased", lang)}
              </span>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {profile?.ebook_purchased ? (
              <>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm text-emerald-800">
                    {t("account.ebookOwned", lang)}
                  </p>
                </div>
                <button
                  onClick={handleDownloadEbook}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md"
                >
                  <Download className="h-4 w-4" />
                  {t("account.downloadEbook", lang)}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-500">
                  {t("account.ebookDesc", lang)}
                </p>
                <button
                  onClick={handleBuyEbook}
                  disabled={ebookLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-amber-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {ebookLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("account.processing", lang)}
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      {t("account.buyEbook", lang)}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            {t("account.quickLinks", lang)}
          </h2>
          <div className="space-y-2">
            <Link
              href="/topics/family"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <Shield className="h-4 w-4" />
              {t("account.browseTopics", lang)}
            </Link>
            {profile?.membership_status === "active" && (
              <Link
                href="/chat"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <Shield className="h-4 w-4" />
                {t("account.aiTutorChat", lang)}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}