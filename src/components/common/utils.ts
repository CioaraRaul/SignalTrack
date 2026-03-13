import type { VehicleStatus, AlertSeverity } from '../../types';

export const STATUS_COLORS: Record<VehicleStatus, string> = {
  active: 'text-emerald-400',
  idle: 'text-amber-400',
  maintenance: 'text-blue-400',
  offline: 'text-slate-400',
  alert: 'text-red-400',
};

export const STATUS_BG: Record<VehicleStatus, string> = {
  active: 'bg-emerald-400',
  idle: 'bg-amber-400',
  maintenance: 'bg-blue-400',
  offline: 'bg-slate-400',
  alert: 'bg-red-400',
};

export const STATUS_BORDER: Record<VehicleStatus, string> = {
  active: 'border-emerald-400',
  idle: 'border-amber-400',
  maintenance: 'border-blue-400',
  offline: 'border-slate-400',
  alert: 'border-red-400',
};

export const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  critical: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-blue-400',
};

export const SEVERITY_BG: Record<AlertSeverity, string> = {
  critical: 'bg-red-500/20 border-red-500/40',
  warning: 'bg-amber-500/20 border-amber-500/40',
  info: 'bg-blue-500/20 border-blue-500/40',
};

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}
