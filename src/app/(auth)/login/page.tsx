"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useT } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t.auth.invalidCredentials);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError(t.auth.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <h1 className="text-2xl font-bold text-center mb-2">{t.common.appName}</h1>
      <p className="text-gray-500 text-center mb-8">{t.auth.loginTitle}</p>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {t.auth.email}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            {t.auth.password}
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
        >
          {loading ? t.auth.signingIn : t.auth.loginButton}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t.auth.noAccount}{" "}
        <Link href="/register" className="text-emerald-600 hover:underline">
          {t.common.register}
        </Link>
      </p>
    </div>
  );
}
