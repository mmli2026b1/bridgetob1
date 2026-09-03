"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Lock, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const TOTAL_PAGES = 31;

export default function EbookReader() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpValue, setJumpValue] = useState("1");
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

  // Copy protection
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

  const goToPage = useCallback((page: number) => {
    const clamped = Math.min(Math.max(page, 1), TOTAL_PAGES);
    setCurrentPage(clamped);
    setJumpValue(String(clamped));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Keyboard navigation (arrow keys)
  useEffect(() => {
    if (!hasAccess) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToPage(currentPage + 1);
      if (e.key === "ArrowLeft") goToPage(currentPage - 1);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [hasAccess, currentPage, goToPage]);

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

  const pageNum = String(currentPage).padStart(2, "0");

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center select-none" onDragStart={(e) => e.preventDefault()}>
      {/* Top navigation bar */}
      <div className="mb-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Page</span>
          <input
            type="text"
            inputMode="numeric"
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value.replace(/[^0-9]/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                goToPage(parseInt(jumpValue || "1", 10));
              }
            }}
            onBlur={() => goToPage(parseInt(jumpValue || "1", 10))}
            className="w-12 rounded-md border border-slate-200 px-2 py-1 text-center text-sm"
          />
          <span>of {TOTAL_PAGES}</span>
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === TOTAL_PAGES}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Page image */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/ebook-pages/page-${pageNum}.jpg`}
          alt={`Ebook page ${currentPage}`}
          className="w-full select-none pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Bottom navigation bar (duplicate for convenience) */}
      <div className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <span className="text-sm text-slate-400">Page {currentPage} of {TOTAL_PAGES}</span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === TOTAL_PAGES}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-slate-300">
        Success Bridge — Online reader only. Please do not share or redistribute.
      </p>
    </div>
  );
}