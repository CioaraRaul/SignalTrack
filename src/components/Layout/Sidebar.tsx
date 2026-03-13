import React from 'react';
import {
  LayoutDashboard,
  Truck,
  Bell,
  Map,
  Settings,
  ChevronRight,
} from 'lucide-react';
import type { ActiveView, FleetStats } from '../../types/fleet';

interface SidebarProps {
  open: boolean;
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  stats: FleetStats;
}

const navItems: {
  id: ActiveView;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'vehicles', label: 'Vehicles', icon: <Truck size={18} /> },
  { id: 'alerts', label: 'Alerts', icon: <Bell size={18} /> },
  { id: 'routes', label: 'Routes', icon: <Map size={18} /> },
];

const Sidebar: React.FC<SidebarProps> = ({
  open,
  activeView,
  onNavigate,
  stats,
}) => {
  return (
    <aside
      className={`fixed top-14 left-0 bottom-0 z-40 flex flex-col bg-slate-900 border-r border-slate-700 transition-all duration-300 ${
        open ? 'w-56' : 'w-0 overflow-hidden'
      }`}
    >
      <nav className="flex-1 py-3 space-y-0.5 px-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className={isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}>
                {item.icon}
              </span>
              <span className="whitespace-nowrap">{item.label}</span>
              {item.id === 'alerts' && stats.activeAlerts > 0 && (
                <span
                  className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    stats.criticalAlerts > 0
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {stats.activeAlerts}
                </span>
              )}
              {isActive && (
                <ChevronRight size={14} className="ml-auto text-blue-400 opacity-60" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Fleet summary */}
      <div className="mx-2 mb-3 p-3 rounded-lg bg-slate-800 border border-slate-700">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
          Fleet Summary
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Active
            </span>
            <span className="text-xs font-semibold text-white">
              {stats.activeVehicles}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Idle
            </span>
            <span className="text-xs font-semibold text-white">
              {stats.idleVehicles}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Maintenance
            </span>
            <span className="text-xs font-semibold text-white">
              {stats.maintenanceVehicles}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              Offline
            </span>
            <span className="text-xs font-semibold text-white">
              {stats.offlineVehicles}
            </span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="px-2 pb-3 border-t border-slate-700 pt-3">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Settings size={18} className="text-slate-500" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
