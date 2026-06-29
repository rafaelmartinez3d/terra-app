import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PriceHistoryChart from "@/components/property/PriceHistoryChart";
import { formatArea } from "@/lib/geo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      location: true,
      agent: { select: { id: true, name: true, email: true } },
      images: { orderBy: { order: "asc" } },
      priceHistory: { orderBy: { recordedAt: "asc" } },
    },
  });

  if (!property) notFound();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
              {property.code}
            </span>
            <Link
              href={`/properties/${id}/edit`}
              className="text-xs text-blue-600 hover:underline"
            >
              Edit
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{property.address}</h1>
          <p className="text-gray-500">
            {property.location.city}, {property.location.state},{" "}
            {property.location.country}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {property.images.length > 0 && (
            <div className="bg-white rounded-xl border p-4">
              <div className="grid grid-cols-2 gap-3">
                {property.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt="Property photo"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Map Preview */}
          <div className="bg-white rounded-xl border p-4">
            <h2 className="font-semibold mb-3">Property Boundary</h2>
            <div className="h-[300px] rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              Map preview — boundary available
            </div>
          </div>

          {/* Price History */}
          <div className="bg-white rounded-xl border p-4">
            <h2 className="font-semibold mb-4">Price History</h2>
            <PriceHistoryChart
              data={property.priceHistory.map((p) => ({
                recordedAt: p.recordedAt.toISOString(),
                value: p.value,
              }))}
              currency={property.costCurrency}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Cost Card */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm text-gray-500 mb-1">Cost</h3>
            <p className="text-2xl font-bold text-emerald-700">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: property.costCurrency,
              }).format(property.costValue)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: property.costCurrency,
              }).format(property.costPerM2)}{" "}
              / m²
            </p>
          </div>

          {/* Area Card */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm text-gray-500 mb-1">Area</h3>
            <p className="text-xl font-bold">
              {property.areaM2.toLocaleString("pt-BR")} m²
            </p>
            <p className="text-sm text-gray-500">{formatArea(property.areaM2)}</p>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm text-gray-500 mb-3">Contact</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{property.contactName}</p>
              <p className="text-gray-600">{property.contactPhone}</p>
              <p className="text-gray-600">{property.contactEmail}</p>
            </div>
          </div>

          {/* Agent Info */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm text-gray-500 mb-3">Real Estate Agent</h3>
            <p className="font-medium text-sm">{property.agent.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{property.agent.email}</p>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl border p-4 text-xs text-gray-400 space-y-1">
            <p>
              Created:{" "}
              {new Date(property.createdAt).toLocaleDateString("pt-BR")}
            </p>
            <p>
              Last edit:{" "}
              {new Date(property.updatedAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
