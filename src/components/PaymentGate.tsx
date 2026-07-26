"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Lock } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

type Props = {
  topicTitle: string;
  children: React.ReactNode;
};

export default function PaymentGate({ topicTitle, children }: Props) {
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { sessionId, error } = await res.json();

      if (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        alert("Stripe is not configured yet. Add your publishable key.");
        setLoading(false);
        return;
      }

      await (stripe as any).redirectToCheckout({ sessionId });
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Blur overlay */}
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="mx-4 max-w-md rounded-2xl border border-slate-200 bg-white/95 p-8 shadow-xl backdrop-blur-xl text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-900">
            {t("payment.premiumContent", lang)}
          </h3>
          <p className="mb-6 text-slate-500">
            {t("payment.description", lang, { topic: topicTitle })}
          </p>
          <ul className="mb-6 space-y-2 text-left text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>{" "}
              {t("payment.feature1", lang)}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>{" "}
              {t("payment.feature2", lang)}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>{" "}
              {t("payment.feature3", lang)}
            </li>
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-base font-bold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? t("payment.redirecting", lang)
              : t("payment.cta", lang)}
          </button>
          <p className="mt-3 text-xs text-slate-400">
            {t("payment.footer", lang)}
          </p>
        </div>
      </div>
    </div>
  );
}
