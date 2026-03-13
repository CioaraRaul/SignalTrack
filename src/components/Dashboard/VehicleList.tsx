import React, { useState } from 'react';
import type { Vehicle, VehicleStatus } from '../../types/fleet';
import {
  Gauge,
  Fuel,
  Thermometer,
  Navigation,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
  onSelect: (vehicle: Vehicle) => void;
  selectedVehicle: Vehicle | null;
}

const statusConfig: Record<
  VehicleStatus,
  { label: string; dot: string; badge: string }
> = {
  active: {
    label: 'Active',
    dot: 'bg-green-500',
    badge: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  idle: {
    label: 'Idle',
    dot: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  maintenance: {
    label: 'Maintenance',
    dot: 'bg-orange-500',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  offline: {
    label: 'Offline',
    dot: 'bg-slate-500',
    badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
};

type SortKey = 'plateNumber' | 'driverName' | 'speed' | 'fuelLevel' | 'status';

const SortIcon: React.FC<{ k: SortKey; sortKey: SortKey; sortAsc: boolean }> = ({
  k,
  sortKey,
  sortAsc,
}) => {
  if (sortKey !== k) return null;
  return sortAsc ? (
    <ChevronUp size={12} className="inline ml-0.5" />
  ) : (
    <ChevronDown size={12} className="inline ml-0.5" />
  );
};

const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  onSelect,
  selectedVehicle,
}) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('plateNumber');
  const [sortAsc, setSortAsc] = useState(true);
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>(
    'all'
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((p) => !p);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filtered = vehicles
    .filter((v) => {
      const q = search.toLowerCase();
      const matchesSearch =
        v.plateNumber.toLowerCase().includes(q) ||
        v.driverName.toLowerCase().includes(q) ||
        (v.route?.toLowerCase().includes(q) ?? false);
      const matchesStatus =
        statusFilter === 'all' || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let av: string | number = a[sortKey] as string | number;
      let bv: string | number = b[sortKey] as string | number;
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });

  const thClass =
    'px-3 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-white whitespace-nowrap';

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 border-b border-slate-700">
        <div className="relative flex-1 min-w-[160px]">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search vehicles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as VehicleStatus | 'all')
          }
          className="px-2.5 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="idle">Idle</option>
          <option value="maintenance">Maintenance</option>
          <option value="offline">Offline</option>
        </select>
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {filtered.length} of {vehicles.length}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-800/80 backdrop-blur">
            <tr>
              <th className={thClass} onClick={() => handleSort('plateNumber')}>
                Vehicle <SortIcon k="plateNumber" sortKey={sortKey} sortAsc={sortAsc} />
              </th>
              <th className={thClass} onClick={() => handleSort('driverName')}>
                Driver <SortIcon k="driverName" sortKey={sortKey} sortAsc={sortAsc} />
              </th>
              <th className={thClass} onClick={() => handleSort('status')}>
                Status <SortIcon k="status" sortKey={sortKey} sortAsc={sortAsc} />
              </th>
              <th className={thClass} onClick={() => handleSort('speed')}>
                <Gauge size={12} className="inline mr-1" />
                Speed <SortIcon k="speed" sortKey={sortKey} sortAsc={sortAsc} />
              </th>
              <th className={thClass} onClick={() => handleSort('fuelLevel')}>
                <Fuel size={12} className="inline mr-1" />
                Fuel <SortIcon k="fuelLevel" sortKey={sortKey} sortAsc={sortAsc} />
              </th>
              <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                <Thermometer size={12} className="inline mr-1" />
                Temp
              </th>
              <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <Navigation size={12} className="inline mr-1" />
                Route
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center text-slate-500 text-sm"
                >
                  No vehicles match your search.
                </td>
              </tr>
            )}
            {filtered.map((vehicle) => {
              const cfg = statusConfig[vehicle.status];
              const isSelected = selectedVehicle?.id === vehicle.id;
              const fuelLow = vehicle.fuelLevel < 40;
              const tempHigh = vehicle.engineTemp > 98;

              return (
                <tr
                  key={vehicle.id}
                  onClick={() => onSelect(vehicle)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-600/10 border-l-2 border-l-blue-500'
                      : 'hover:bg-slate-800/60'
                  }`}
                >
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs font-semibold text-white">
                      {vehicle.plateNumber}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">
                    {vehicle.driverName}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${cfg.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">
                    {vehicle.status === 'active' ? (
                      <span className="font-semibold">{vehicle.speed}</span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}{' '}
                    {vehicle.status === 'active' && (
                      <span className="text-slate-500 text-xs">mph</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            vehicle.fuelLevel < 30
                              ? 'bg-red-500'
                              : vehicle.fuelLevel < 50
                              ? 'bg-amber-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${vehicle.fuelLevel}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          fuelLow ? 'text-amber-400' : 'text-slate-300'
                        }`}
                      >
                        {vehicle.fuelLevel}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    {vehicle.engineTemp > 0 ? (
                      <span
                        className={`text-xs font-medium ${
                          tempHigh ? 'text-red-400' : 'text-slate-300'
                        }`}
                      >
                        {vehicle.engineTemp}°C
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-slate-400 text-xs max-w-[160px] truncate">
                    {vehicle.route}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleList;
