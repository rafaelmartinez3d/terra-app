import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  try {
    // Nominatim reverse geocoding (free, OpenStreetMap)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=pt-BR`;

    const response = await fetch(url, {
      headers: { "User-Agent": "TerraApp/1.0" },
    });

    if (!response.ok) {
      return NextResponse.json({ address: "Address not found" });
    }

    const data = await response.json();
    const address = data.display_name || "Address not found";

    return NextResponse.json({ address });
  } catch {
    return NextResponse.json({ address: "Geocoding unavailable" });
  }
}
