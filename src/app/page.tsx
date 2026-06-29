"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function HomePage() {
  const { t } = useT();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-emerald-800 mb-4">
          {t.landing.title}
        </h1>
        <p className="text-xl text-gray-600 mb-2">{t.landing.subtitle}</p>
        <p className="text-gray-400 mb-10">{t.landing.description}</p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 font-medium text-lg"
          >
            {t.common.signIn}
          </Link>
          <Link
            href="/register"
            className="border border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 font-medium text-lg"
          >
            {t.common.register}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-2xl mb-2">🗺️</div>
            <h3 className="font-semibold mb-1">{t.landing.feature1Title}</h3>
            <p className="text-sm text-gray-500">{t.landing.feature1Desc}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold mb-1">{t.landing.feature2Title}</h3>
            <p className="text-sm text-gray-500">{t.landing.feature2Desc}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-2xl mb-2">📸</div>
            <h3 className="font-semibold mb-1">{t.landing.feature3Title}</h3>
            <p className="text-sm text-gray-500">{t.landing.feature3Desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
