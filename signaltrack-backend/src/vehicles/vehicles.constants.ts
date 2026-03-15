export const VEHICLE_STATUS = {
  MOVING: 'moving',
  IDLE: 'idle',
  OFFLINE: 'offline',
  ALERT: 'alert',
} as const;

export const VEHICLE_STATUSES = Object.values(VEHICLE_STATUS);
