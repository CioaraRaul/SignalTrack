export type VehicleStatus =
  | 'active'
  | 'idle'
  | 'maintenance'
  | 'offline'
  | 'alert';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertType =
  | 'speeding'
  | 'harsh_braking'
  | 'route_deviation'
  | 'engine_fault'
  | 'low_fuel'
  | 'geofence_breach'
  | 'accident'
  | 'driver_fatigue'
  | 'cargo_temp';

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  driver: string;
  status: VehicleStatus;
  location: GeoLocation;
  speed: number; // km/h
  heading: number; // degrees
  fuel: number; // percentage
  engineTemp: number; // °C
  odometer: number; // km
  lastSeen: Date;
  route?: string;
  cargo?: string;
}

export interface Alert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  location: GeoLocation;
  timestamp: Date;
  acknowledged: boolean;
}

export interface FleetStats {
  totalVehicles: number;
  activeVehicles: number;
  idleVehicles: number;
  maintenanceVehicles: number;
  offlineVehicles: number;
  alertVehicles: number;
  criticalAlerts: number;
  warningAlerts: number;
  averageSpeed: number;
  totalDistanceToday: number;
}
