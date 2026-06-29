"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useT } from "@/lib/i18n/LanguageContext";
import PriceHistoryChart from "@/components/property/PriceHistoryChart";
import { formatArea } from "@/lib/geo";

interface Property {
  id: string;
  code: string;
  address: string;
  boundary: string;
  areaM2: number;
  costValue: number;
  costCurrency: string;
  costPerM2: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
  location: { city: string; state: string; country: string };
  agent: { id: string; name: string; email: string };
  images: { id: string; url: string }[];
  priceHistory: { recordedAt: string; value: number }[];
}

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { t } = useT();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((r) => r.json())
      .then(setProperty)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-gray-400">{t.common.loading}</div>;
  }

  if (!property) {
    return <div className="text-center py-20 text-gray-400">Property not found.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
              {property.code}
            </span>
            <Link href={`/properties/${id}/edit`} className="text-xs text-blue-600 hover:underline">
              {t.common.edit}
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{property.address}</h1>
          <p className="text-gray-500">
            {property.location.city}, {property.location.state}, {property.location.country}
          </p>
        </div>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
          {t.common.back}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {property.images.length > 0 && (
            <div className="bg-white rounded-xl border p-4">
              <div className="grid grid-cols-2 gap-3">
                {property.images.map((img) => (
                  <img key={img.id} src={img.url} alt={t.property.images} className="w-full h-48 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border p-4">
            <h2 className="font-semibold mb-3">{t.property.boundary}</h2>
            <div className="h-[300px] rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              {t.property.boundaryPlaceholder}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <h2 className="font-semibold mb-4">{t.property.priceHistory}</h2>
            <PriceHistoryChart
              data={property.priceHistory.map((p) => ({
                recordedAt: p.recordedAt,
                value: p.value,
              }))}
              currency={property.costCurrency}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm text-gray-500 mb-1">{t.property.cost}</h3>
            <p className="text-2xl font-bold text-emerald-700">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: property.costCurrency }).format(property.costValue)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: property.costCurrency }).format(property.costPerM2)} / m²
            </p>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm text-gray-500 mb-1">{t.property.area}</h3>
            <p className="text-xl font-bold">{property.areaM2.toLocaleString("pt-BR")} m²</p>
            <p className="text-sm text-gray-500">{formatArea(property.areaM2)}</p>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm text-gray-500 mb-3">{t.property.contact}</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{property.contactName}</p>
              <p className="text-gray-600">{property.contactPhone}</p>
              <p className="text-gray-600">{property.contactEmail}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm text-gray-500 mb-3">{t.property.agent}</h3>
            <p className="font-medium text-sm">{property.agent.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{property.agent.email}</p>
          </div>

          <div className="bg-white rounded-xl border p-4 text-xs text-gray-400 space-y-1">
            <p>{t.property.created}: {new Date(property.createdAt).toLocaleDateString("pt-BR")}</p>
            <p>{t.property.lastEdit}: {new Date(property.updatedAt).toLocaleDateString("pt-BR")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
