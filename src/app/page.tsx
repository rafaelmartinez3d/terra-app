import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-emerald-800 mb-4">Terra App</h1>
        <p className="text-xl text-gray-600 mb-2">
          Land Registry Platform for Santa Catarina
        </p>
        <p className="text-gray-400 mb-10">
          Register, manage, and track land properties with interactive maps.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 font-medium text-lg"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="border border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 font-medium text-lg"
          >
            Register
          </Link>
        </div>

        {/* Feature preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-2xl mb-2">🗺️</div>
            <h3 className="font-semibold mb-1">Draw on Map</h3>
            <p className="text-sm text-gray-500">
              Draw property boundaries directly on an interactive map. Area
              calculated automatically.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold mb-1">Track Prices</h3>
            <p className="text-sm text-gray-500">
              Monitor price history over time with charts. See cost per square
              meter instantly.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-2xl mb-2">📸</div>
            <h3 className="font-semibold mb-1">Upload Photos</h3>
            <p className="text-sm text-gray-500">
              Add property photos with drag-and-drop. Optimized for fast loading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
