"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { en, pt } from "./dictionaries";

export type Language = "en" | "pt";
export type Dictionary = typeof en;

const dictionaries: Record<Language, Dictionary> = { en, pt };

interface LanguageContextType {
  lang: Language;
  t: Dictionary;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "pt",
  t: pt,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("pt");

  useEffect(() => {
    const stored = localStorage.getItem("terra-lang") as Language | null;
    if (stored === "en" || stored === "pt") {
      setLang(stored);
    } else {
      // Default to Portuguese (Brazil)
      setLang("pt");
    }
  }, []);

  const setLanguage = useCallback((language: Language) => {
    setLang(language);
    localStorage.setItem("terra-lang", language);
  }, []);

  return (
    <LanguageContext.Provider
      value={{ lang, t: dictionaries[lang], setLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const { t, lang, setLanguage } = useContext(LanguageContext);
  return { t, lang, setLanguage };
}
