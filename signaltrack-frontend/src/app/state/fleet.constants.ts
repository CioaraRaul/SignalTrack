import { VehicleStatus } from './models/vehicle.model';

export const STATUS_COLORS: Record<VehicleStatus, string> = {
  moving: '#22c55e',
  idle: '#eab308',
  offline: '#9ca3af',
  alert: '#ef4444',
};

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  moving: 'În mișcare',
  idle: 'Staționar',
  offline: 'Offline',
  alert: 'Alertă',
};
