"use client";

import { useT, Language } from "@/lib/i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLanguage } = useT();

  const toggle = () => {
    setLanguage(lang === "pt" ? "en" : "pt");
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border hover:bg-gray-50 transition-colors"
      title={lang === "pt" ? "Switch to English" : "Mudar para Português"}
    >
      <span role="img" aria-label="flag">
        {lang === "pt" ? "🇧🇷" : "🇺🇸"}
      </span>
      <span>{lang === "pt" ? "PT" : "EN"}</span>
    </button>
  );
}
