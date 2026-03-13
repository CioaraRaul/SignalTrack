import { useState, useEffect } from 'react';
import { Radio, Wifi } from 'lucide-react';
import type { FleetStats } from '../../types';

interface HeaderProps {
  stats: FleetStats;
}

export function Header({ stats }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setPulse((p) => !p);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-slate-900/80 border-b border-slate-700/50 backdrop-blur-sm z-10 flex-shrink-0">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="bg-indigo-600 rounded-lg p-2">
            <Radio size={20} className="text-white" />
          </div>
          <span
            className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 transition-opacity duration-700 ${
              pulse ? 'opacity-100' : 'opacity-40'
            }`}
          />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight tracking-tight">SignalTrack</h1>
          <p className="text-slate-400 text-xs">Fleet Monitoring Dashboard</p>
        </div>
      </div>

      {/* Live indicator + quick stats */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-1.5">
          <Wifi size={12} className="text-emerald-400" />
          <span className="text-emerald-400 text-xs font-semibold">LIVE</span>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg leading-tight tabular-nums">{stats.totalVehicles}</p>
          <p className="text-slate-400 text-xs">Vehicles</p>
        </div>
        <div className="text-center">
          <p className={`font-bold text-lg leading-tight tabular-nums ${stats.criticalAlerts > 0 ? 'text-red-400' : 'text-white'}`}>
            {stats.criticalAlerts}
          </p>
          <p className="text-slate-400 text-xs">Critical</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg leading-tight tabular-nums">{stats.averageSpeed}</p>
          <p className="text-slate-400 text-xs">Avg km/h</p>
        </div>
      </div>

      {/* Clock */}
      <div className="text-right">
        <p className="text-white font-bold text-lg tabular-nums leading-tight">{timeStr}</p>
        <p className="text-slate-400 text-xs">{dateStr}</p>
      </div>
    </header>
  );
}
