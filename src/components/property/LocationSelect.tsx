"use client";

import { useState, useEffect } from "react";

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
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all states on mount
  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then(setStates)
      .catch(console.error);
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }
    setLoading(true);
    fetch(`/api/locations?state=${encodeURIComponent(selectedState)}`)
      .then((r) => r.json())
      .then((data) => {
        setCities(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedState]);

  // If we have an initial location, fetch its state and city
  useEffect(() => {
    if (initialLocationId && cities.length > 0) {
      // City ID will be set from the parent anyway
    }
  }, [initialLocationId, cities]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <select
          className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          disabled
          value="Brasil"
        >
          <option>Brasil</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">State</label>
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
          <option value="">Select state</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">City</label>
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
          <option value="">
            {loading ? "Loading..." : "Select city"}
          </option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
