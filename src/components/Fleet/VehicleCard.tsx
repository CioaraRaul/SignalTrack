import type { Vehicle } from '../../types';
import { Fuel, Thermometer, Gauge, Navigation, Package, User } from 'lucide-react';
import { STATUS_BG, STATUS_COLORS, formatTimeAgo } from '../common/utils';
import { StatusBadge } from '../common/StatusBadge';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onClick: () => void;
}

export function VehicleCard({ vehicle, isSelected, onClick }: VehicleCardProps) {
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
        : 'text-slate-300';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
        isSelected
          ? 'bg-indigo-600/20 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/60'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-white font-semibold text-sm leading-tight">{vehicle.name}</p>
          <p className="text-slate-400 text-xs">{vehicle.plate}</p>
        </div>
        <StatusBadge
          status={vehicle.status}
          bgClass={STATUS_BG[vehicle.status]}
          colorClass={STATUS_COLORS[vehicle.status]}
        />
      </div>

      <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
        <User size={11} />
        <span className="truncate">{vehicle.driver}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-300">
          <Gauge size={11} className="text-slate-500" />
          <span>{vehicle.speed} km/h</span>
        </div>
        <div className={`flex items-center gap-1 ${fuelColor}`}>
          <Fuel size={11} />
          <span>{vehicle.fuel}%</span>
        </div>
        <div className={`flex items-center gap-1 ${tempColor}`}>
          <Thermometer size={11} />
          <span>{vehicle.engineTemp}°C</span>
        </div>
      </div>

      {vehicle.route && (
        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          <Navigation size={10} />
          <span className="truncate">{vehicle.route}</span>
        </div>
      )}

      {vehicle.cargo && (
        <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
          <Package size={10} />
          <span className="truncate">{vehicle.cargo}</span>
        </div>
      )}

      <p className="text-slate-600 text-xs mt-1.5">{formatTimeAgo(vehicle.lastSeen)}</p>
    </button>
  );
}
