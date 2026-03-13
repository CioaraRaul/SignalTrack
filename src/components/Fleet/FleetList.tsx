import { useState, useMemo } from 'react';
import type { Vehicle, VehicleStatus } from '../../types';
import { VehicleCard } from './VehicleCard';
import { Search, SlidersHorizontal } from 'lucide-react';

const STATUS_FILTERS: { label: string; value: VehicleStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Idle', value: 'idle' },
  { label: 'Alert', value: 'alert' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Offline', value: 'offline' },
];

const FILTER_ACTIVE_STYLES: Record<VehicleStatus | 'all', string> = {
  all: 'bg-slate-600 text-white',
  active: 'bg-emerald-600 text-white',
  idle: 'bg-amber-600 text-white',
  alert: 'bg-red-600 text-white',
  maintenance: 'bg-blue-600 text-white',
  offline: 'bg-slate-500 text-white',
};

interface FleetListProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onVehicleSelect: (id: string | null) => void;
}

export function FleetList({ vehicles, selectedVehicleId, onVehicleSelect }: FleetListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchStatus = statusFilter === 'all' || v.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.plate.toLowerCase().includes(q) ||
        v.driver.toLowerCase().includes(q) ||
        (v.route ?? '').toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [vehicles, statusFilter, search]);

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search vehicles, drivers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Status filter pills */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {STATUS_FILTERS.map((f) => {
          const count = f.value === 'all' ? vehicles.length : vehicles.filter((v) => v.status === f.value).length;
          const isActive = statusFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all font-medium ${
                isActive
                  ? `${FILTER_ACTIVE_STYLES[f.value]} border-transparent`
                  : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
              }`}
            >
              {f.label} <span className="opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Sort indicator */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
        <SlidersHorizontal size={11} />
        <span>{filtered.length} vehicles shown</span>
      </div>

      {/* Vehicle list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-8">No vehicles match your search</div>
        ) : (
          filtered.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={vehicle.id === selectedVehicleId}
              onClick={() => onVehicleSelect(vehicle.id === selectedVehicleId ? null : vehicle.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
