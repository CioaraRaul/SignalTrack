import type { Alert, AlertType } from '../../types';
import {
  AlertTriangle,
  Zap,
  Navigation,
  Wrench,
  Fuel,
  MapPin,
  Clock,
  ShieldAlert,
  Wind,
  Thermometer,
  CheckCircle,
  BellOff,
} from 'lucide-react';
import { SEVERITY_BG, SEVERITY_COLORS, formatTimeAgo } from '../common/utils';

const ALERT_ICONS: Record<AlertType, React.ReactNode> = {
  speeding: <Zap size={14} />,
  harsh_braking: <AlertTriangle size={14} />,
  route_deviation: <Navigation size={14} />,
  engine_fault: <Wrench size={14} />,
  low_fuel: <Fuel size={14} />,
  geofence_breach: <MapPin size={14} />,
  accident: <ShieldAlert size={14} />,
  driver_fatigue: <Clock size={14} />,
  cargo_temp: <Thermometer size={14} />,
};

const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  speeding: 'Speeding',
  harsh_braking: 'Harsh Braking',
  route_deviation: 'Route Deviation',
  engine_fault: 'Engine Fault',
  low_fuel: 'Low Fuel',
  geofence_breach: 'Geofence Breach',
  accident: 'Accident',
  driver_fatigue: 'Driver Fatigue',
  cargo_temp: 'Cargo Temp',
};

interface AlertItemProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
}

function AlertItem({ alert, onAcknowledge }: AlertItemProps) {
  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        alert.acknowledged
          ? 'bg-slate-800/30 border-slate-700/30 opacity-50'
          : SEVERITY_BG[alert.severity]
      }`}
    >
      <div className="flex items-start gap-2">
        <span className={`mt-0.5 flex-shrink-0 ${alert.acknowledged ? 'text-slate-500' : SEVERITY_COLORS[alert.severity]}`}>
          {ALERT_ICONS[alert.type]}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={`text-xs font-bold uppercase tracking-wide ${alert.acknowledged ? 'text-slate-500' : SEVERITY_COLORS[alert.severity]}`}>
              {ALERT_TYPE_LABELS[alert.type]}
            </span>
            <span className="text-slate-500 text-xs whitespace-nowrap">{formatTimeAgo(alert.timestamp)}</span>
          </div>
          <p className="text-slate-200 text-xs leading-snug">{alert.message}</p>
          <p className="text-slate-500 text-xs mt-0.5">{alert.vehicleName}</p>
        </div>
        {!alert.acknowledged && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            title="Acknowledge"
            className="flex-shrink-0 text-slate-500 hover:text-emerald-400 transition-colors mt-0.5"
          >
            <CheckCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onAcknowledgeAll: () => void;
}

export function AlertsPanel({ alerts, onAcknowledge, onAcknowledgeAll }: AlertsPanelProps) {
  const unacked = alerts.filter((a) => !a.acknowledged);
  const critical = unacked.filter((a) => a.severity === 'critical');
  const warning = unacked.filter((a) => a.severity === 'warning');
  const info = unacked.filter((a) => a.severity === 'info');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className={unacked.length > 0 ? 'text-red-400 animate-pulse' : 'text-slate-400'} />
          <span className="text-white font-semibold text-sm">Alerts</span>
          {unacked.length > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">
              {unacked.length}
            </span>
          )}
        </div>
        {unacked.length > 0 && (
          <button
            onClick={onAcknowledgeAll}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <BellOff size={12} />
            Ack all
          </button>
        )}
      </div>

      {/* Summary pills */}
      {unacked.length > 0 && (
        <div className="flex gap-2 mb-3">
          {critical.length > 0 && (
            <span className="bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold rounded px-2 py-0.5">
              {critical.length} Critical
            </span>
          )}
          {warning.length > 0 && (
            <span className="bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold rounded px-2 py-0.5">
              {warning.length} Warning
            </span>
          )}
          {info.length > 0 && (
            <span className="bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-semibold rounded px-2 py-0.5">
              {info.length} Info
            </span>
          )}
        </div>
      )}

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
            <Wind size={32} className="text-slate-600" />
            <p className="text-sm">No alerts — fleet running smoothly</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onAcknowledge={onAcknowledge}
            />
          ))
        )}
      </div>
    </div>
  );
}
