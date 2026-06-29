"use client";

import { useState, useEffect } from "react";
import { useT } from "@/lib/i18n/LanguageContext";

interface City {
  id: number;
  city: string;
}

interface LocationSelectProps {
  initialLocationId?: number;
  onLocationChange: (locationId: number | null) => void;
}

export default function LocationSelect({
  initialLocationId,
  onLocationChange,
}: LocationSelectProps) {
  const { t } = useT();
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then(setStates)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedState) { setCities([]); return; }
    setLoading(true);
    fetch(`/api/locations?state=${encodeURIComponent(selectedState)}`)
      .then((r) => r.json())
      .then((data) => { setCities(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedState]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t.property.country}</label>
        <select
          className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          disabled
          value="Brasil"
        >
          <option>Brasil</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t.property.state}</label>
        <select
          className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCityId(null);
            onLocationChange(null);
          }}
          required
        >
          <option value="">{t.property.selectState}</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t.property.city}</label>
        <select
          className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          value={selectedCityId ?? ""}
          onChange={(e) => {
            const id = e.target.value ? Number(e.target.value) : null;
            setSelectedCityId(id);
            onLocationChange(id);
          }}
          required
          disabled={!selectedState || loading}
        >
          <option value="">{loading ? t.property.loadingLocations : t.property.selectCity}</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.city}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
