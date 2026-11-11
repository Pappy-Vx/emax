'use client';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

// OSM's public tiles are fine for light use; set NEXT_PUBLIC_MAP_TILE_URL (e.g. MapTiler/Stadia) for heavier traffic.
const TILE_URL = process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const PIN_HTML = `
  <div style="position:relative;width:28px;height:28px">
    <span class="runner-pin-pulse"></span>
    <span style="position:absolute;inset:5px;border-radius:9999px;background:#fdbd2a;border:3px solid #1c2a43;box-shadow:0 2px 6px rgba(0,0,0,.35)"></span>
  </div>`;

export default function LiveMap({ lat, lng, accuracy, label = 'Your runner', className = '' }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const posRef = useRef({ lat, lng, accuracy });
  posRef.current = { lat, lng, accuracy };

  useEffect(() => {
    let cancelled = false;
    import('leaflet').then((mod) => {
      const L = mod.default ?? mod;
      if (cancelled || !elRef.current) return;
      const p = posRef.current;
      const map = L.map(elRef.current, { scrollWheelZoom: false }).setView([p.lat, p.lng], 16);
      L.tileLayer(TILE_URL, { maxZoom: 19, attribution: TILE_ATTRIBUTION }).addTo(map);
      const icon = L.divIcon({ className: '', html: PIN_HTML, iconSize: [28, 28], iconAnchor: [14, 14] });
      const marker = L.marker([p.lat, p.lng], { icon, title: label, keyboard: false }).addTo(map);
      const circle = L.circle([p.lat, p.lng], {
        radius: p.accuracy || 0, color: '#fdbd2a', weight: 1, fillColor: '#fdbd2a', fillOpacity: 0.12, interactive: false,
      }).addTo(map);
      mapRef.current = { map, marker, circle };
    });
    return () => {
      cancelled = true;
      mapRef.current?.map.remove();
      mapRef.current = null;
    };
  }, [label]);

  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    m.marker.setLatLng([lat, lng]);
    m.circle.setLatLng([lat, lng]);
    m.circle.setRadius(accuracy || 0);
    // Follow the runner only when they move out of view, so the customer can still pan around.
    if (!m.map.getBounds().pad(-0.15).contains([lat, lng])) m.map.panTo([lat, lng]);
  }, [lat, lng, accuracy]);

  return <div ref={elRef} className={`z-0 ${className}`} role="region" aria-label="Map showing your runner's live location" />;
}
