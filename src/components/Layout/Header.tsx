import React from 'react';
import {
  Truck,
  Bell,
  Menu,
  X,
  Radio,
} from 'lucide-react';
import type { Alert } from '../../types/fleet';

interface HeaderProps {
  unacknowledgedAlerts: Alert[];
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onAlertClick: () => void;
  currentTime: Date;
}

const Header: React.FC<HeaderProps> = ({
  unacknowledgedAlerts,
  sidebarOpen,
  onToggleSidebar,
  onAlertClick,
  currentTime,
}) => {
  const criticalCount = unacknowledgedAlerts.filter(
    (a) => a.severity === 'critical'
  ).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-slate-900 border-b border-slate-700">
      {/* Left: menu + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
            <Truck size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-white font-bold text-sm tracking-wide">
              CargoTrack
            </span>
            <span className="text-blue-400 font-bold text-sm tracking-wide ml-1">
              Sentinel
            </span>
          </div>
        </div>
      </div>

      {/* Center: live indicator */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-600">
        <div className="relative flex items-center justify-center w-2 h-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </div>
        <Radio size={12} className="text-green-400" />
        <span className="text-xs text-green-400 font-medium">LIVE</span>
        <span className="text-xs text-slate-400 ml-1">
          {currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      </div>

      {/* Right: alerts bell + user */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAlertClick}
          className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label={`Alerts — ${unacknowledgedAlerts.length} unacknowledged`}
        >
          <Bell size={18} />
          {unacknowledgedAlerts.length > 0 && (
            <span
              className={`absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full text-white ${
                criticalCount > 0 ? 'bg-red-500' : 'bg-amber-500'
              }`}
            >
              {unacknowledgedAlerts.length}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white select-none">
            FM
          </div>
          <span className="hidden md:block text-sm text-slate-300">
            Fleet Manager
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
