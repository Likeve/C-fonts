"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { t, Lang } from "@/lib/i18n";

export default function Footer() {
  const { lang, setLang, label } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const langOptions: Array<{ value: Lang; display: string }> = [
    { value: "zh", display: "简体中文" },
    { value: "zh-Hant", display: "繁體中文" },
    { value: "en", display: "English" },
  ];

  return (
    <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500">
      <p className="mb-4">
        {t("footerCopyright", lang)} &copy; {new Date().getFullYear()}
      </p>
      <div ref={ref} className="relative inline-block text-left">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          {label}
          <svg className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            {langOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setLang(opt.value); setOpen(false); }}
                className={`block w-full whitespace-nowrap px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-50 ${lang === opt.value ? "font-medium text-zinc-900" : "text-zinc-600"}`}
              >
                {opt.display}
              </button>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
