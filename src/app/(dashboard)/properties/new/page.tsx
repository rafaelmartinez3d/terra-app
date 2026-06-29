"use client";

import PropertyForm from "@/components/property/PropertyForm";
import { useT } from "@/lib/i18n/LanguageContext";

export default function NewPropertyPage() {
  const { t } = useT();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t.property.newProperty}</h1>
      <div className="bg-white rounded-xl border p-6">
        <PropertyForm />
      </div>
    </div>
  );
}
