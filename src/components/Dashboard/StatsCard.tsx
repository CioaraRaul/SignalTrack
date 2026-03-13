import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'cyan';
  pulse?: boolean;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-400 bg-blue-500/20',
    value: 'text-blue-300',
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: 'text-green-400 bg-green-500/20',
    value: 'text-green-300',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: 'text-amber-400 bg-amber-500/20',
    value: 'text-amber-300',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-400 bg-red-500/20',
    value: 'text-red-300',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: 'text-purple-400 bg-purple-500/20',
    value: 'text-purple-300',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    icon: 'text-cyan-400 bg-cyan-500/20',
    value: 'text-cyan-300',
  },
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  pulse,
}) => {
  const colors = colorMap[color];

  return (
    <div
      className={`relative rounded-xl border p-4 ${colors.bg} ${colors.border} flex items-center gap-4`}
    >
      {pulse && (
        <span
          className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500`}
        >
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
        </span>
      )}
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 ${colors.icon}`}
      >
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
          {title}
        </p>
        <p className={`text-2xl font-bold ${colors.value}`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
