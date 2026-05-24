"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { lang, toggleLang, label } = useLanguage();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
      <p className="mb-4">
        中文字体库 &copy; {new Date().getFullYear()}
      </p>
      <button
        onClick={toggleLang}
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        {lang === "zh" ? "Switch to English" : "切换到中文"}
      </button>
    </footer>
  );
}
