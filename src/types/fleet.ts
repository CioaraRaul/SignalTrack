export type VehicleStatus = 'active' | 'idle' | 'maintenance' | 'offline';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertType =
  | 'speed_violation'
  | 'geofence_breach'
  | 'harsh_braking'
  | 'engine_fault'
  | 'fuel_low'
  | 'route_deviation'
  | 'idle_timeout'
  | 'cargo_temp';

export interface Vehicle {
  id: string;
  plateNumber: string;
  driverName: string;
  status: VehicleStatus;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  fuelLevel: number;
  engineTemp: number;
  odometer: number;
  lastUpdated: Date;
  route?: string;
  cargo?: string;
  distanceToday: number;
}

export interface Alert {
  id: string;
  vehicleId: string;
  plateNumber: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  lat?: number;
  lng?: number;
}

export interface FleetStats {
  totalVehicles: number;
  activeVehicles: number;
  idleVehicles: number;
  maintenanceVehicles: number;
  offlineVehicles: number;
  totalDistanceToday: number;
  averageFuelLevel: number;
  activeAlerts: number;
  criticalAlerts: number;
}

export interface PerformanceDataPoint {
  time: string;
  activeVehicles: number;
  alerts: number;
  avgSpeed: number;
}

export type ActiveView = 'dashboard' | 'vehicles' | 'alerts' | 'routes';
