"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500">
      <p className="mb-4">
        {t("footerCopyright", lang)} &copy; {new Date().getFullYear()}
      </p>

      <p className="mb-4 text-zinc-600">
        {t("footerSuggestions", lang)}
      </p>

      <div className="flex items-center justify-center gap-2">
        <a
          href="mailto:q1b2kbkk@gmail.com"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {t("footerContact", lang)}
        </a>
      </div>
    </footer>
  );
}
