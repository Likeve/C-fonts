"use client";

import { useLanguage } from "./LanguageProvider";
import { t } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const { lang, toggleLang, label } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/font.svg" alt="Logo" width={32} height={32} className="h-8 w-8" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {t("siteTitle", lang)}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              {t("siteDesc", lang)}
            </p>
          </div>
        </Link>

        <button
          onClick={toggleLang}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {label}
        </button>
      </div>
    </header>
  );
}
