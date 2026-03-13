import type React from 'react';
import type { Alert, AlertSeverity, AlertType } from '../../types/fleet';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Gauge,
  MapPin,
  Zap,
  Fuel,
  Thermometer,
  Clock,
  Navigation,
  CheckCircle,
  BellOff,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  showAll?: boolean;
}

const severityConfig: Record<
  AlertSeverity,
  {
    icon: React.ReactNode;
    bg: string;
    border: string;
    text: string;
    badge: string;
  }
> = {
  critical: {
    icon: <AlertTriangle size={14} />,
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  warning: {
    icon: <AlertCircle size={14} />,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  info: {
    icon: <Info size={14} />,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
};

const typeIcons: Record<AlertType, React.ReactNode> = {
  speed_violation: <Gauge size={13} />,
  geofence_breach: <MapPin size={13} />,
  harsh_braking: <Zap size={13} />,
  engine_fault: <Thermometer size={13} />,
  fuel_low: <Fuel size={13} />,
  route_deviation: <Navigation size={13} />,
  idle_timeout: <Clock size={13} />,
  cargo_temp: <Thermometer size={13} />,
};

const typeLabels: Record<AlertType, string> = {
  speed_violation: 'Speed Violation',
  geofence_breach: 'Geofence Breach',
  harsh_braking: 'Harsh Braking',
  engine_fault: 'Engine Fault',
  fuel_low: 'Fuel Low',
  route_deviation: 'Route Deviation',
  idle_timeout: 'Idle Timeout',
  cargo_temp: 'Cargo Temp',
};

const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onAcknowledge,
  showAll = false,
}) => {
  const sorted = [...alerts].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  const displayed = showAll ? sorted : sorted.slice(0, 8);

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-slate-500 gap-2">
        <BellOff size={24} className="opacity-40" />
        <span className="text-sm">No alerts</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-full pr-0.5">
      {displayed.map((alert) => {
        const cfg = severityConfig[alert.severity];
        return (
          <div
            key={alert.id}
            className={`rounded-lg border p-3 transition-opacity ${cfg.bg} ${cfg.border} ${
              alert.acknowledged ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <span className={`mt-0.5 flex-shrink-0 ${cfg.text}`}>
                  {cfg.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wide ${cfg.badge}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-700 text-slate-400 border border-slate-600">
                      {typeIcons[alert.type]}
                      {typeLabels[alert.type]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      {alert.plateNumber}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {formatDistanceToNow(alert.timestamp, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {!alert.acknowledged && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  title="Acknowledge alert"
                  className="flex-shrink-0 p-1 rounded text-slate-500 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                >
                  <CheckCircle size={16} />
                </button>
              )}
              {alert.acknowledged && (
                <span
                  title="Acknowledged"
                  className="flex-shrink-0 text-green-600"
                >
                  <CheckCircle size={16} />
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertsPanel;
