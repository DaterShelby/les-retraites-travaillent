"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ServiceRow } from "@/types/database";

interface ServiceWithProvider extends ServiceRow {
  provider?: {
    first_name: string;
    avatar_url?: string | null;
    average_rating?: number;
    total_reviews?: number;
    is_verified?: boolean;
    is_super_pro?: boolean;
  };
}

interface ServiceMapProps {
  services: ServiceWithProvider[];
  onServiceClick?: (serviceId: string) => void;
}

const DEFAULT_CENTER: [number, number] = [46.603354, 1.888334]; // France center
const DEFAULT_ZOOM = 6;

function formatPrice(price: number | null | undefined): string {
  if (!price) return "";
  return `${price}€`;
}

function createMarkerIcon(price: number | null | undefined): L.DivIcon {
  const priceLabel = price ? `${price}€` : "—";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: #4A6670;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      border: 2px solid white;
      transform: translate(-50%, -100%);
      cursor: pointer;
    ">${priceLabel}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function createActiveMarkerIcon(price: number | null | undefined): L.DivIcon {
  const priceLabel = price ? `${price}€` : "—";
  return L.divIcon({
    className: "custom-marker-active",
    html: `<div style="
      background: #F0917B;
      color: white;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(240,145,123,0.4);
      border: 2px solid white;
      transform: translate(-50%, -100%) scale(1.1);
      cursor: pointer;
    ">${priceLabel}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export function ServiceMap({ services, onServiceClick }: ServiceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);
    let hasValidCoords = false;

    services.forEach((service) => {
      const lat = service.latitude;
      const lng = service.longitude;

      if (lat == null || lng == null || lat === 0 || lng === 0) return;

      hasValidCoords = true;
      const isActive = service.id === selectedId;
      const icon = isActive
        ? createActiveMarkerIcon(service.price_amount)
        : createMarkerIcon(service.price_amount);

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      const popupContent = `
        <div style="min-width: 200px; font-family: 'Source Sans Pro', sans-serif;">
          <div style="font-weight: 600; font-size: 15px; color: #2F3D42; margin-bottom: 4px;">
            ${service.title}
          </div>
          <div style="color: #6B7280; font-size: 13px; margin-bottom: 6px;">
            ${service.provider?.first_name || "Prestataire"} · ${service.city || ""}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-weight: 700; color: #F0917B; font-size: 15px;">
              ${formatPrice(service.price_amount)}${service.price_type === "hourly" ? "/h" : ""}
            </span>
            ${service.provider?.average_rating ? `<span style="color: #F59E0B; font-size: 13px;">★ ${service.provider.average_rating.toFixed(1)}</span>` : ""}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        className: "custom-popup",
        offset: [0, -10],
      });

      marker.on("click", () => {
        setSelectedId(service.id);
        onServiceClick?.(service.id);
      });

      bounds.extend([lat, lng]);
      markersRef.current.push(marker);
    });

    if (hasValidCoords) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [services, selectedId, onServiceClick]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          border: 1px solid rgba(0,0,0,0.05);
          padding: 0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px 16px;
        }
        .custom-popup .leaflet-popup-tip {
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .custom-marker, .custom-marker-active {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
