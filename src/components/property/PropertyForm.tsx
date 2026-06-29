"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { calculatePricePerM2 } from "@/lib/geo";
import { useT } from "@/lib/i18n/LanguageContext";
import dynamic from "next/dynamic";
import LocationSelect from "./LocationSelect";
import ImageUpload from "./ImageUpload";

const PropertyMap = dynamic(
  () => import("@/components/map/PropertyMap"),
  { ssr: false, loading: () => <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">{/* t.property.mapLoading */}</div> },
);

const CURRENCIES = [
  { code: "BRL", label: "R$ (Real)" },
  { code: "USD", label: "$ (Dólar)" },
  { code: "EUR", label: "€ (Euro)" },
];

interface PropertyFormProps {
  initialData?: {
    id: string;
    locationId: number;
    address: string;
    boundary: string | null;
    areaM2: number;
    costValue: number;
    costCurrency: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    images: { url: string }[];
  };
  isEditing?: boolean;
}

export default function PropertyForm({ initialData, isEditing }: PropertyFormProps) {
  const router = useRouter();
  const { t } = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [locationId, setLocationId] = useState<number | null>(initialData?.locationId ?? null);
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [boundary, setBoundary] = useState<string | null>(initialData?.boundary ?? null);
  const [areaM2, setAreaM2] = useState(initialData?.areaM2 ?? 0);
  const [costValue, setCostValue] = useState(initialData?.costValue ?? 0);
  const [costCurrency, setCostCurrency] = useState(initialData?.costCurrency ?? "BRL");
  const [contactName, setContactName] = useState(initialData?.contactName ?? "");
  const [contactPhone, setContactPhone] = useState(initialData?.contactPhone ?? "");
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail ?? "");
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const pricePerM2 = calculatePricePerM2(costValue, areaM2);

  const handlePolygonDrawn = useCallback((geojson: string, area: number) => {
    setBoundary(geojson);
    setAreaM2(area);
  }, []);

  const handlePinPlaced = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/geocode?lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data.address && data.address !== "Address not found") {
        setAddress(data.address);
      }
    } catch {
      // geocoding unavailable
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!locationId) { setError(t.property.missingCity); return; }
    if (!address.trim()) { setError(t.property.missingAddress); return; }
    if (!boundary) { setError(t.property.missingBoundary); return; }
    if (costValue <= 0) { setError(t.property.missingCost); return; }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("locationId", String(locationId));
      formData.append("address", address);
      formData.append("boundary", boundary!);
      formData.append("areaM2", String(areaM2));
      formData.append("costValue", String(costValue));
      formData.append("costCurrency", costCurrency);
      formData.append("contactName", contactName);
      formData.append("contactPhone", contactPhone);
      formData.append("contactEmail", contactEmail);

      imageFiles.forEach((file) => formData.append("images", file));

      const url = isEditing
        ? `/api/properties/${initialData?.id}`
        : "/api/properties";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t.property.saveError);
      }

      const property = await res.json();
      router.push(`/properties/${property.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.property.saveError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">{error}</div>
      )}

      {/* Map Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t.property.drawOnMap}</h2>
        <p className="text-sm text-gray-500 mb-3">{t.property.drawInstructions}</p>
        <div className="h-[450px]">
          <PropertyMap
            onPolygonDrawn={handlePolygonDrawn}
            onPinPlaced={handlePinPlaced}
            initialPolygon={initialData?.boundary ?? null}
          />
        </div>
        {areaM2 > 0 && (
          <p className="text-sm text-emerald-700 mt-2 font-medium">
            {t.property.area}: {areaM2.toLocaleString("pt-BR")} m²
            {areaM2 >= 10000 && ` (${(areaM2 / 10000).toFixed(2)} ${t.property.hectares})`}
          </p>
        )}
      </div>

      {/* Location Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t.property.location}</h2>
        <LocationSelect
          initialLocationId={initialData?.locationId}
          onLocationChange={setLocationId}
        />
      </div>

      {/* Address */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t.property.address}</h2>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t.property.addressPlaceholder}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
      </div>

      {/* Cost Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t.property.cost}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1">{t.property.currency}</label>
            <select
              value={costCurrency}
              onChange={(e) => setCostCurrency(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">{t.property.value}</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={costValue || ""}
              onChange={(e) => setCostValue(Number(e.target.value))}
              placeholder="0.00"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.property.pricePerM2}</label>
            <input
              type="text"
              value={
                pricePerM2 > 0
                  ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: costCurrency }).format(pricePerM2)
                  : "—"
              }
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t.property.contact}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.property.contactName}</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.property.contactPhone}</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="(48) 99999-9999"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.property.contactEmail}</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@example.com"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Photos Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t.property.photos}</h2>
        <ImageUpload
          onImagesSelected={setImageFiles}
          existingImages={initialData?.images.map((i) => i.url) ?? []}
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
        >
          {loading ? t.common.saving : isEditing ? t.property.updateButton : t.property.createButton}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 font-medium"
        >
          {t.common.cancel}
        </button>
      </div>
    </form>
  );
}
