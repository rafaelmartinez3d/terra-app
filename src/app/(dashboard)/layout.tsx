"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useT } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useT();
  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-5 border-b">
          <Link href="/dashboard" className="text-xl font-bold text-emerald-700">
            {t.common.appName}
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">{t.common.tagline}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-medium text-sm">
            {t.nav.dashboard}
          </Link>
          <Link href="/properties/new" className="block px-3 py-2 rounded-lg hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-medium text-sm">
            {t.nav.newProperty}
          </Link>
        </nav>

        <div className="p-4 border-t space-y-3">
          <LanguageSwitcher />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
              {session?.user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name || "Agent"}</p>
              <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ redirectTo: "/login" })}
            className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50"
          >
            {t.common.signOut}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
