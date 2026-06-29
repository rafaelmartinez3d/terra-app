// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  center?: [number, number];
  zoom?: number;
  onPolygonDrawn?: (geojson: string, areaM2: number) => void;
  onPinPlaced?: (lat: number, lng: number) => void;
  initialPolygon?: string | null;
  readOnly?: boolean;
}

export default function PropertyMap({
  center = [-27.5, -50.0],
  zoom = 7,
  onPolygonDrawn,
  onPinPlaced,
  initialPolygon,
  readOnly = false,
}: PropertyMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const drawnLayerRef = useRef<L.FeatureGroup | null>(null);

  // Store callbacks in refs so they don't cause map re-init on re-render
  const onPolygonDrawnRef = useRef(onPolygonDrawn);
  const onPinPlacedRef = useRef(onPinPlaced);
  onPolygonDrawnRef.current = onPolygonDrawn;
  onPinPlacedRef.current = onPinPlaced;

  // Store center/zoom in refs to avoid re-init
  const centerRef = useRef(center);
  const zoomRef = useRef(zoom);
  centerRef.current = center;
  zoomRef.current = zoom;

  // Init map exactly once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView(centerRef.current, zoomRef.current);

    // Base layers
    const streetLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      },
    );

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          '&copy; <a href="https://www.esri.com/">Esri</a> | Maxar, Earthstar Geographics',
        maxZoom: 19,
      },
    );

    // Default to street, add layer control
    streetLayer.addTo(map);

    L.control
      .layers(
        { Street: streetLayer, Satellite: satelliteLayer },
        {},
        { position: "topright", collapsed: false },
      )
      .addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnLayerRef.current = drawnItems;

    // Initial polygon if provided (on first render)
    if (initialPolygon) {
      try {
        const geo = JSON.parse(initialPolygon);
        const layer = L.geoJSON(geo);
        drawnItems.addLayer(layer);
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds);
        }
      } catch {
        // ignore invalid geojson
      }
    }

    // Drawing controls
    if (!readOnly) {
      const drawControl = new L.Control.Draw({
        draw: {
          polygon: { allowIntersection: false, showArea: true },
          rectangle: {},
          polyline: false,
          circle: false,
          circlemarker: false,
          marker: {
            icon: L.divIcon({
              className: "custom-marker",
              html: '<div style="background:#059669;color:white;padding:4px 8px;border-radius:4px;font-weight:bold;white-space:nowrap">📍 Pin</div>',
              iconSize: [60, 30],
              iconAnchor: [30, 30],
            }),
          },
        },
        edit: {
          featureGroup: drawnItems,
          edit: true,
          remove: true,
        },
      });
      map.addControl(drawControl);

      // Polygon/rectangle drawn — use refs for callbacks
      map.on(L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        drawnItems.clearLayers();
        drawnItems.addLayer(layer);

        const geojson = layer.toGeoJSON();
        const geojsonStr = JSON.stringify(geojson);
        const areaM2 = calculateArea(geojson);
        onPolygonDrawnRef.current?.(geojsonStr, areaM2);
      });

      // Map click for pin — use ref for callback
      map.on("click", (e) => {
        onPinPlacedRef.current?.(e.latlng.lat, e.latlng.lng);
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Only run on mount/unmount — never re-init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="h-full w-full rounded-lg border"
      style={{ minHeight: "400px" }}
    />
  );
}

function calculateArea(geojson: Record<string, unknown>): number {
  try {
    const coords = extractCoords(geojson);
    if (!coords || coords.length < 3) return 0;

    let area = 0;
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      area += coords[i][0] * coords[j][1];
      area -= coords[j][0] * coords[i][1];
    }
    area = Math.abs(area) / 2;

    const latMid = coords.reduce((s, c) => s + c[1], 0) / coords.length;
    const mPerDegLat = 111320;
    const mPerDegLng = 111320 * Math.cos((latMid * Math.PI) / 180);
    const areaM2 = area * mPerDegLat * mPerDegLng;

    return Math.round(areaM2 * 100) / 100;
  } catch {
    return 0;
  }
}

function extractCoords(geojson: Record<string, unknown>): number[][] | null {
  const geometry = (geojson.geometry || geojson) as Record<string, unknown>;
  const type = geometry.type as string;
  const coords = geometry.coordinates as number[][][];

  if (type === "Polygon" && coords?.[0]) return coords[0];
  if (type === "MultiPolygon" && coords?.[0]?.[0]) return coords[0][0];
  return null;
}
