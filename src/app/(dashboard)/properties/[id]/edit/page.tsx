"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useT } from "@/lib/i18n/LanguageContext";
import PropertyForm from "@/components/property/PropertyForm";

interface PropertyData {
  id: string;
  code: string;
  locationId: number;
  address: string;
  boundary: string;
  areaM2: number;
  costValue: number;
  costCurrency: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  images: { url: string }[];
}

export default function EditPropertyPage() {
  const params = useParams();
  const id = params.id as string;
  const { t } = useT();
  const [property, setProperty] = useState<PropertyData | null>(null);
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
      <h1 className="text-2xl font-bold mb-1">{t.property.editProperty}</h1>
      <p className="text-gray-500 mb-6 text-sm">
        {t.property.code}: {property.code}
      </p>
      <div className="bg-white rounded-xl border p-6">
        <PropertyForm isEditing initialData={property} />
      </div>
    </div>
  );
}
