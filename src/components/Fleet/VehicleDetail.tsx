import type { Vehicle } from '../../types';
import {
  Fuel,
  Thermometer,
  Gauge,
  Navigation,
  Package,
  User,
  Truck,
  MapPin,
  X,
  Hash,
} from 'lucide-react';
import { STATUS_BG, STATUS_COLORS, formatNumber, formatTime } from '../common/utils';
import { StatusBadge } from '../common/StatusBadge';

interface VehicleDetailProps {
  vehicle: Vehicle;
  onClose: () => void;
}

function MetricRow({
  icon,
  label,
  value,
  valueClass = 'text-white',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function FuelBar({ fuel }: { fuel: number }) {
  const color =
    fuel < 20 ? 'bg-red-500' : fuel < 40 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="mt-1 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${fuel}%` }}
      />
    </div>
  );
}

export function VehicleDetail({ vehicle, onClose }: VehicleDetailProps) {
  const fuelColor =
    vehicle.fuel < 20
      ? 'text-red-400'
      : vehicle.fuel < 40
        ? 'text-amber-400'
        : 'text-emerald-400';
  const tempColor =
    vehicle.engineTemp > 98
      ? 'text-red-400'
      : vehicle.engineTemp > 93
        ? 'text-amber-400'
        : 'text-white';

  return (
    <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-700 rounded-lg p-2.5">
            <Truck size={20} className="text-slate-300" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">{vehicle.name}</h3>
            <p className="text-slate-400 text-sm">{vehicle.plate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge
            status={vehicle.status}
            bgClass={STATUS_BG[vehicle.status]}
            colorClass={STATUS_COLORS[vehicle.status]}
          />
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors ml-2"
            aria-label="Close details"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Driver & Route */}
      <div className="bg-slate-900/50 rounded-lg p-3 space-y-1.5">
        <div className="flex items-center gap-2 text-sm">
          <User size={14} className="text-slate-400 flex-shrink-0" />
          <span className="text-slate-400">Driver:</span>
          <span className="text-white font-medium">{vehicle.driver}</span>
        </div>
        {vehicle.route && (
          <div className="flex items-center gap-2 text-sm">
            <Navigation size={14} className="text-slate-400 flex-shrink-0" />
            <span className="text-slate-400">Route:</span>
            <span className="text-white font-medium">{vehicle.route}</span>
          </div>
        )}
        {vehicle.cargo && (
          <div className="flex items-center gap-2 text-sm">
            <Package size={14} className="text-slate-400 flex-shrink-0" />
            <span className="text-slate-400">Cargo:</span>
            <span className="text-white font-medium">{vehicle.cargo}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} className="text-slate-400 flex-shrink-0" />
          <span className="text-slate-400">Position:</span>
          <span className="text-white font-mono text-xs">
            {vehicle.location.lat.toFixed(4)}°N, {vehicle.location.lng.toFixed(4)}°E
          </span>
        </div>
      </div>

      {/* Live metrics */}
      <div className="bg-slate-900/50 rounded-lg p-3">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Live Telemetry</p>
        <MetricRow
          icon={<Gauge size={14} />}
          label="Speed"
          value={`${vehicle.speed} km/h`}
        />
        <MetricRow
          icon={<Fuel size={14} />}
          label="Fuel Level"
          value={`${vehicle.fuel}%`}
          valueClass={fuelColor}
        />
        <div className="pb-2 border-b border-slate-700/50">
          <FuelBar fuel={vehicle.fuel} />
        </div>
        <MetricRow
          icon={<Thermometer size={14} />}
          label="Engine Temp"
          value={`${vehicle.engineTemp}°C`}
          valueClass={tempColor}
        />
        <MetricRow
          icon={<Hash size={14} />}
          label="Odometer"
          value={`${formatNumber(vehicle.odometer)} km`}
        />
        <MetricRow
          icon={<Navigation size={14} />}
          label="Heading"
          value={`${Math.round(vehicle.heading)}°`}
        />
        <div className="pt-2">
          <p className="text-slate-500 text-xs">Last update: {formatTime(vehicle.lastSeen)}</p>
        </div>
      </div>
    </div>
  );
}
