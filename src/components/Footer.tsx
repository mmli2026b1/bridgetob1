"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
      <p>© {new Date().getFullYear()} {t("footer.copyright", lang)}</p>
    </footer>
  );
}
