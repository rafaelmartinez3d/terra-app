import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const properties = await prisma.property.findMany({
    include: {
      location: true,
      agent: { select: { name: true } },
      images: { take: 1, orderBy: { order: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {properties.length} propert{properties.length === 1 ? "y" : "ies"} registered
          </p>
        </div>
        <Link
          href="/properties/new"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium text-sm"
        >
          + New Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-5xl mb-4">🗺️</p>
          <h2 className="text-xl font-semibold mb-2">No properties yet</h2>
          <p className="text-gray-500 mb-6">
            Start by adding your first land or plot.
          </p>
          <Link
            href="/properties/new"
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 font-medium inline-block"
          >
            Add First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="bg-white rounded-xl border hover:shadow-md transition-shadow overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gray-100 relative">
                {property.images[0] ? (
                  <img
                    src={property.images[0].url}
                    alt={property.code}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                    {property.code}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(property.updatedAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 truncate">
                  {property.address}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {property.location.city}, {property.location.state}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-sm text-gray-600">
                    {property.areaM2.toLocaleString("pt-BR")} m²
                  </span>
                  <span className="font-semibold text-emerald-700">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: property.costCurrency,
                      notation: "compact",
                    }).format(property.costValue)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
