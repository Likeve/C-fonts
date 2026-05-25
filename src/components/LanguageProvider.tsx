"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { Lang } from "@/lib/i18n";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  label: string;
}

const langLabels: Record<Lang, string> = {
  zh: "简体中文",
  "zh-Hant": "繁體中文",
  en: "English",
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  label: "English",
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "zh" || saved === "zh-Hant" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  }, []);

  const label = langLabels[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, label }}>
      {children}
    </LanguageContext.Provider>
  );
}
