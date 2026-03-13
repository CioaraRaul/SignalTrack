import { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Vehicle } from '../../types';
import { STATUS_COLORS } from '../common/utils';

// Fix Leaflet default icon paths when bundled with Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STATUS_MARKER_COLORS: Record<Vehicle['status'], string> = {
  active: '#10b981',
  idle: '#f59e0b',
  maintenance: '#3b82f6',
  offline: '#64748b',
  alert: '#ef4444',
};

function createVehicleIcon(vehicle: Vehicle, isSelected: boolean): L.DivIcon {
  const color = STATUS_MARKER_COLORS[vehicle.status];
  const size = isSelected ? 36 : 28;
  const border = isSelected ? '3px solid #fff' : '2px solid rgba(255,255,255,0.5)';
  const shadow = isSelected ? '0 0 0 3px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.4)';

  const arrowSvg = vehicle.status === 'active'
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(${vehicle.heading}deg)">
        <polygon points="12 2 19 21 12 14 5 21"/>
       </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="${size * 0.7}" height="${size * 0.7}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8l5 5v5h-5V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
       </svg>`;

  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:50%;
      border:${border};
      box-shadow:${shadow};
      display:flex;align-items:center;justify-content:center;
      cursor:pointer;
      transition:all 0.2s ease;
    ">${arrowSvg}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
}

interface MapUpdaterProps {
  selectedVehicle: Vehicle | null;
}

function MapUpdater({ selectedVehicle }: MapUpdaterProps) {
  const map = useMap();
  useEffect(() => {
    if (selectedVehicle) {
      map.flyTo(
        [selectedVehicle.location.lat, selectedVehicle.location.lng],
        13,
        { duration: 1.2 },
      );
    }
  }, [selectedVehicle, map]);
  return null;
}

interface FleetMapProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onVehicleSelect: (id: string) => void;
}

export function FleetMap({ vehicles, selectedVehicleId, onVehicleSelect }: FleetMapProps) {
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) ?? null;
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-700/50">
      <MapContainer
        center={[51.1657, 10.4515]}
        zoom={6}
        className="w-full h-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />
        <MapUpdater selectedVehicle={selectedVehicle} />
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.location.lat, vehicle.location.lng]}
            icon={createVehicleIcon(vehicle, vehicle.id === selectedVehicleId)}
            eventHandlers={{
              click: () => onVehicleSelect(vehicle.id),
            }}
            zIndexOffset={vehicle.id === selectedVehicleId ? 1000 : 0}
          >
            <Popup className="vehicle-popup" minWidth={220}>
              <div className="bg-slate-800 text-white rounded-lg p-3 -m-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{vehicle.name}</span>
                  <span className={`text-xs font-semibold uppercase ${STATUS_COLORS[vehicle.status]}`}>
                    {vehicle.status}
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between"><span>Driver</span><span className="text-white">{vehicle.driver}</span></div>
                  <div className="flex justify-between"><span>Plate</span><span className="text-white">{vehicle.plate}</span></div>
                  <div className="flex justify-between"><span>Speed</span><span className="text-white">{vehicle.speed} km/h</span></div>
                  <div className="flex justify-between"><span>Fuel</span><span className={`font-semibold ${vehicle.fuel < 20 ? 'text-red-400' : 'text-white'}`}>{vehicle.fuel}%</span></div>
                  <div className="flex justify-between"><span>Route</span><span className="text-white">{vehicle.route}</span></div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-700 rounded-lg p-3 z-[400] backdrop-blur-sm">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Status</p>
        {(Object.entries(STATUS_MARKER_COLORS) as [Vehicle['status'], string][]).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2 text-xs text-slate-300 mb-1 last:mb-0">
            <span className="w-3 h-3 rounded-full inline-block flex-shrink-0" style={{ background: color }} />
            <span className="capitalize">{status}</span>
          </div>
        ))}
      </div>

      {/* Vehicle count overlay */}
      <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 z-[400] backdrop-blur-sm">
        <p className="text-white text-sm font-bold">{vehicles.length} vehicles</p>
        <p className="text-slate-400 text-xs">{vehicles.filter(v => v.status === 'active').length} on route</p>
      </div>
    </div>
  );
}
