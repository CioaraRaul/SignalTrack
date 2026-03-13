import React from 'react';
import type { Vehicle } from '../../types/fleet';
import {
  X,
  Truck,
  User,
  Gauge,
  Fuel,
  Thermometer,
  Navigation,
  Package,
  Activity,
  Milestone,
  Clock,
} from 'lucide-react';

interface VehicleDetailProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  active: 'text-green-400 bg-green-500/10 border-green-500/20',
  idle: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  maintenance: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  offline: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

const Row: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
    <span className="text-slate-500 flex-shrink-0">{icon}</span>
    <span className="text-xs text-slate-500 w-28 flex-shrink-0">{label}</span>
    <span className="text-sm text-slate-200 font-medium">{value}</span>
  </div>
);

const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle, onClose }) => {
  const statusClass = statusColors[vehicle.status];
  const fuelColor =
    vehicle.fuelLevel < 30
      ? 'bg-red-500'
      : vehicle.fuelLevel < 50
      ? 'bg-amber-500'
      : 'bg-green-500';
  const tempColor = vehicle.engineTemp > 98 ? 'text-red-400' : 'text-slate-200';

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Truck size={18} className="text-blue-400" />
          </div>
          <div>
            <p className="font-mono font-bold text-white text-sm">
              {vehicle.plateNumber}
            </p>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border capitalize ${statusClass}`}
            >
              {vehicle.status}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Close vehicle detail"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <Row
          icon={<User size={14} />}
          label="Driver"
          value={vehicle.driverName}
        />
        <Row
          icon={<Navigation size={14} />}
          label="Current Route"
          value={<span className="text-blue-300">{vehicle.route}</span>}
        />
        <Row
          icon={<Package size={14} />}
          label="Cargo"
          value={vehicle.cargo}
        />
        <Row
          icon={<Gauge size={14} />}
          label="Speed"
          value={
            vehicle.status === 'active' ? (
              <span>
                <span className="font-bold text-white">{vehicle.speed}</span>{' '}
                <span className="text-slate-500 text-xs">mph</span>
              </span>
            ) : (
              <span className="text-slate-500">Stationary</span>
            )
          }
        />
        <Row
          icon={<Fuel size={14} />}
          label="Fuel Level"
          value={
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${fuelColor}`}
                  style={{ width: `${vehicle.fuelLevel}%` }}
                />
              </div>
              <span
                className={`font-bold ${vehicle.fuelLevel < 40 ? 'text-amber-400' : 'text-white'}`}
              >
                {vehicle.fuelLevel}%
              </span>
            </div>
          }
        />
        <Row
          icon={<Thermometer size={14} />}
          label="Engine Temp"
          value={
            vehicle.engineTemp > 0 ? (
              <span className={`font-bold ${tempColor}`}>
                {vehicle.engineTemp}°C
              </span>
            ) : (
              <span className="text-slate-500">Engine Off</span>
            )
          }
        />
        <Row
          icon={<Milestone size={14} />}
          label="Odometer"
          value={
            <span>
              {vehicle.odometer.toLocaleString()}{' '}
              <span className="text-slate-500 text-xs">miles</span>
            </span>
          }
        />
        <Row
          icon={<Activity size={14} />}
          label="Distance Today"
          value={
            <span>
              <span className="font-bold text-white">
                {vehicle.distanceToday}
              </span>{' '}
              <span className="text-slate-500 text-xs">miles</span>
            </span>
          }
        />
        <Row
          icon={<Clock size={14} />}
          label="Last Updated"
          value={
            <span className="text-xs">
              {vehicle.lastUpdated.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          }
        />
        <Row
          icon={<Navigation size={14} />}
          label="Coordinates"
          value={
            <span className="font-mono text-xs">
              {vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)}
            </span>
          }
        />
      </div>
    </div>
  );
};

export default VehicleDetail;
