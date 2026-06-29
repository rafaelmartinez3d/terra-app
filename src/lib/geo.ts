import { area } from "@turf/area";
import { polygon } from "@turf/helpers";

export function calculateAreaFromGeoJSON(geojson: string): number {
  try {
    const parsed = JSON.parse(geojson);
    const coords = parsed.coordinates || parsed.geometry?.coordinates;
    if (!coords) return 0;

    // Support both Polygon and MultiPolygon
    let rings: number[][][] = [];
    if (parsed.type === "Polygon" || parsed.geometry?.type === "Polygon") {
      rings = coords;
    } else if (
      parsed.type === "MultiPolygon" ||
      parsed.geometry?.type === "MultiPolygon"
    ) {
      rings = coords[0]; // use first polygon
    }

    if (rings.length === 0) return 0;

    const poly = polygon(rings);
    const areaM2 = area(poly);
    return Math.round(areaM2 * 100) / 100; // round to 2 decimal places
  } catch {
    return 0;
  }
}

export function formatArea(areaM2: number): string {
  if (areaM2 >= 10000) {
    return `${(areaM2 / 10000).toFixed(2)} ha`;
  }
  return `${areaM2.toLocaleString("pt-BR")} m²`;
}

export function calculatePricePerM2(
  costValue: number,
  areaM2: number,
): number {
  if (areaM2 <= 0) return 0;
  return Math.round((costValue / areaM2) * 100) / 100;
}
