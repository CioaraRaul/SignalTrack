import type { FleetStats } from '../../types';
import {
  Truck,
  Activity,
  AlertTriangle,
  WifiOff,
  Wrench,
  Clock,
  Gauge,
  Route,
} from 'lucide-react';
import { formatNumber } from '../common/utils';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  sub?: string;
}

function KpiCard({ label, value, icon, color, sub }: KpiCardProps) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
      <div className={`rounded-lg p-2.5 ${color}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide truncate">{label}</p>
        <p className="text-white text-2xl font-bold leading-tight">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

interface FleetStatsGridProps {
  stats: FleetStats;
}

export function FleetStatsGrid({ stats }: FleetStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        label="Total Fleet"
        value={stats.totalVehicles}
        icon={<Truck size={20} className="text-white" />}
        color="bg-slate-600"
        sub={`${stats.activeVehicles} active`}
      />
      <KpiCard
        label="Critical Alerts"
        value={stats.criticalAlerts}
        icon={<AlertTriangle size={20} className="text-white" />}
        color={stats.criticalAlerts > 0 ? 'bg-red-600' : 'bg-slate-600'}
        sub={`${stats.warningAlerts} warnings`}
      />
      <KpiCard
        label="Avg. Speed"
        value={`${stats.averageSpeed} km/h`}
        icon={<Gauge size={20} className="text-white" />}
        color="bg-indigo-600"
        sub="active vehicles"
      />
      <KpiCard
        label="Distance Today"
        value={`${formatNumber(stats.totalDistanceToday)} km`}
        icon={<Route size={20} className="text-white" />}
        color="bg-emerald-700"
      />
      <KpiCard
        label="On Route"
        value={stats.activeVehicles}
        icon={<Activity size={20} className="text-white" />}
        color="bg-emerald-700"
      />
      <KpiCard
        label="Idle"
        value={stats.idleVehicles}
        icon={<Clock size={20} className="text-white" />}
        color="bg-amber-700"
      />
      <KpiCard
        label="Maintenance"
        value={stats.maintenanceVehicles}
        icon={<Wrench size={20} className="text-white" />}
        color="bg-blue-700"
      />
      <KpiCard
        label="Offline"
        value={stats.offlineVehicles}
        icon={<WifiOff size={20} className="text-white" />}
        color="bg-slate-600"
      />
    </div>
  );
}
