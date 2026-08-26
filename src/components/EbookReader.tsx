"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { ebookChapters } from "@/lib/ebookContent";
import { Lock, Loader2, BookOpen, Languages } from "lucide-react";

export default function EbookReader() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeChapter, setActiveChapter] = useState(ebookChapters[0]?.id);
  const [showArabic, setShowArabic] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("ebook_purchased")
        .eq("id", user.id)
        .single();

      setHasAccess(!!profile?.ebook_purchased);
      setLoading(false);
    };
    check();
  }, []);

  useEffect(() => {
    if (!hasAccess) return;

    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    const preventCopyShortcuts = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["c", "p", "s", "u"].includes(key)) {
        e.preventDefault();
      }
      if (key === "printscreen") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventCopyShortcuts);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventCopyShortcuts);
    };
  }, [hasAccess]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <Lock className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-slate-900">Ebook Not Purchased</h1>
        <p className="mb-6 text-slate-500">You need to purchase the Success Bridge Ebook to access the online reader.</p>
        <a href="/account" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-500">Go to Account to Purchase</a>
      </div>
    );
  }

  const chapter = ebookChapters.find((c) => c.id === activeChapter) ?? ebookChapters[0];

  return (
    <div className="flex flex-col gap-6 lg:flex-row select-none" onDragStart={(e) => e.preventDefault()}>
      <div className="lg:w-72">
        <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Chapters</h2>
          </div>
          <div className="flex flex-col gap-1">
            {ebookChapters.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChapter(c.id)}
                className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  activeChapter === c.id ? "bg-emerald-100 text-emerald-800" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {c.titleEn}
              </button>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <button
              onClick={() => setShowArabic((s) => !s)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Languages className="h-4 w-4" />
              {showArabic ? "Hide Arabic" : "Show Arabic"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">{chapter.titleEn}</h1>
        {showArabic && (
          <h2 dir="rtl" className="mb-6 text-xl font-bold text-slate-600">
            {chapter.titleAr}
          </h2>
        )}

        <div className="prose prose-slate max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed text-slate-700">{chapter.contentEn}</div>

          {showArabic && (
            <div dir="rtl" className="mt-8 whitespace-pre-wrap border-t border-slate-100 pt-8 text-right leading-relaxed text-slate-700">
              {chapter.contentAr}
            </div>
          )}
        </div>

        <p className="mt-8 border-t border-slate-100 pt-4 text-center text-xs text-slate-300">
          Success Bridge — Online reader only. Please do not share or redistribute.
        </p>
      </div>
    </div>
  );
}