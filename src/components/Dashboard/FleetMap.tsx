import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Vehicle, Alert } from '../../types/fleet';

interface FleetMapProps {
  vehicles: Vehicle[];
  alerts: Alert[];
  onVehicleSelect: (vehicle: Vehicle) => void;
  selectedVehicle: Vehicle | null;
}

const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',
  idle: '#f59e0b',
  maintenance: '#f97316',
  offline: '#64748b',
};

function createVehicleIcon(vehicle: Vehicle, selected: boolean): L.DivIcon {
  const color = STATUS_COLORS[vehicle.status];
  const size = selected ? 44 : 36;
  const ringSize = selected ? 56 : 48;
  const svg = `
    <svg width="${ringSize}" height="${ringSize}" viewBox="0 0 ${ringSize} ${ringSize}" xmlns="http://www.w3.org/2000/svg">
      ${selected ? `<circle cx="${ringSize / 2}" cy="${ringSize / 2}" r="${ringSize / 2 - 2}" fill="none" stroke="${color}" stroke-width="2" opacity="0.5"/>` : ''}
      <circle cx="${ringSize / 2}" cy="${ringSize / 2}" r="${size / 2}" fill="${color}" opacity="0.2"/>
      <circle cx="${ringSize / 2}" cy="${ringSize / 2}" r="${size / 2 - 4}" fill="${color}"/>
      <text x="${ringSize / 2}" y="${ringSize / 2 + 1}" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="${selected ? 14 : 12}" font-family="monospace" font-weight="bold">🚛</text>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [ringSize, ringSize],
    iconAnchor: [ringSize / 2, ringSize / 2],
    popupAnchor: [0, -ringSize / 2 - 4],
  });
}

function createAlertIcon(): L.DivIcon {
  const svg = `
    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <polygon points="14,3 25,24 3,24" fill="#ef4444" opacity="0.9"/>
      <text x="14" y="22" text-anchor="middle" fill="white" font-size="14" font-weight="bold">!</text>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
  });
}

const FleetMap: React.FC<FleetMapProps> = ({
  vehicles,
  alerts,
  onVehicleSelect,
  selectedVehicle,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const alertMarkersRef = useRef<L.Marker[]>([]);

  // Initialise map once
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [38, -78],
      zoom: 6,
      zoomControl: true,
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update vehicle markers whenever vehicles change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove stale markers
    const vehicleIds = new Set(vehicles.map((v) => v.id));
    markersRef.current.forEach((marker, id) => {
      if (!vehicleIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    vehicles.forEach((vehicle) => {
      const isSelected = selectedVehicle?.id === vehicle.id;
      const icon = createVehicleIcon(vehicle, isSelected);

      if (markersRef.current.has(vehicle.id)) {
        const marker = markersRef.current.get(vehicle.id)!;
        marker.setLatLng([vehicle.lat, vehicle.lng]);
        marker.setIcon(icon);
      } else {
        const marker = L.marker([vehicle.lat, vehicle.lng], { icon })
          .addTo(map)
          .bindPopup(
            `
            <div style="min-width:180px">
              <div style="font-weight:700;font-size:13px;margin-bottom:6px;color:#e2e8f0">${vehicle.plateNumber}</div>
              <div style="font-size:11px;color:#94a3b8;margin-bottom:4px">Driver: ${vehicle.driverName}</div>
              <div style="font-size:11px;color:#94a3b8;margin-bottom:4px">Status: <span style="color:${STATUS_COLORS[vehicle.status]};font-weight:600">${vehicle.status.toUpperCase()}</span></div>
              <div style="font-size:11px;color:#94a3b8;margin-bottom:4px">Speed: ${vehicle.speed} mph</div>
              <div style="font-size:11px;color:#94a3b8;margin-bottom:4px">Fuel: ${vehicle.fuelLevel}%</div>
              <div style="font-size:11px;color:#94a3b8">Route: ${vehicle.route}</div>
            </div>
          `,
            { className: '' }
          );
        marker.on('click', () => onVehicleSelect(vehicle));
        markersRef.current.set(vehicle.id, marker);
      }
    });
  }, [vehicles, selectedVehicle, onVehicleSelect]);

  // Update alert markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    alertMarkersRef.current.forEach((m) => m.remove());
    alertMarkersRef.current = [];

    const unacked = alerts.filter(
      (a) => !a.acknowledged && a.severity === 'critical' && a.lat && a.lng
    );
    unacked.forEach((alert) => {
      const marker = L.marker([alert.lat!, alert.lng!], {
        icon: createAlertIcon(),
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:180px"><div style="font-weight:700;font-size:12px;color:#ef4444;margin-bottom:4px">⚠ CRITICAL ALERT</div><div style="font-size:11px;color:#e2e8f0">${alert.message}</div></div>`
        );
      alertMarkersRef.current.push(marker);
    });
  }, [alerts]);

  // Pan to selected vehicle
  useEffect(() => {
    if (selectedVehicle && mapRef.current) {
      mapRef.current.flyTo([selectedVehicle.lat, selectedVehicle.lng], 10, {
        duration: 1.2,
      });
      const marker = markersRef.current.get(selectedVehicle.id);
      if (marker) marker.openPopup();
    }
  }, [selectedVehicle]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-700">
      <div ref={mapContainerRef} className="w-full h-full" />
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 z-[400] flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg px-3 py-2">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
          Vehicle Status
        </p>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: color }}
            />
            <span className="text-xs text-slate-400 capitalize">{status}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-slate-700">
          <span className="text-xs">⚠</span>
          <span className="text-xs text-red-400">Critical Alert</span>
        </div>
      </div>
    </div>
  );
};

export default FleetMap;
