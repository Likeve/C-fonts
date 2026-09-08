"use client";

import { useState, useEffect, useRef } from"react";
import { useLanguage } from"./LanguageProvider";
import { t, Lang } from"@/lib/i18n";
import { UserMenu } from"./UserMenu";
import { createClient } from"@/lib/supabase/client";
import LoginModal from"./LoginModal";
import Link from"next/link";
import Image from"next/image";

export default function Header() {
  const { lang, setLang, label } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const langOptions: Array<{ value: Lang; display: string }> = [
    { value: "zh", display: "简体中文" },
    { value: "zh-Hant", display: "繁體中文" },
    { value: "en", display: "English" },
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setShowLoginModal(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-50/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/font.svg" alt="Logo" width={32} height={32} className="h-8 w-8" />
          <div>
            <span className="text-lg font-bold tracking-tight text-zinc-900">
              {t("siteTitle", lang)}
            </span>
            <p className="text-xs text-zinc-500 hidden sm:block">
              {t("siteDesc", lang)}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-200/60"
            >
              {label}
              <svg className={`h-3 w-3 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg z-50">
                {langOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setLang(opt.value); setLangOpen(false); }}
                    className={`block w-full whitespace-nowrap px-3 py-1.5 text-left text-sm transition-colors hover:bg-zinc-50 ${lang === opt.value ? "font-medium text-zinc-900" : "text-zinc-600"}`}
                  >
                    {opt.display}
                  </button>
                ))}
              </div>
            )}
          </div>

          <UserMenu />

          <LoginModal
            open={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          />
        </div>
      </div>
    </header>
  );
}
