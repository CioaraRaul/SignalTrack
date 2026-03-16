import { VehicleStatus } from './vehicle.model';

export interface TelemetryPayload {
  vehicleId: string;
  lat: number;
  lng: number;
  speed: number;
  fuelLevel: number;
}

export interface AlertResult {
  type: 'speed' | 'fuel';
  value: number;
  threshold: number;
}

export interface ProcessedTelemetry {
  vehicleId: string;
  status: VehicleStatus;
  lat: number;
  lng: number;
  speed: number;
  fuelLevel: number;
  lastUpdate: string;
  alerts: AlertResult[];
}

export interface AlertEvent {
  vehicleId: string;
  alerts: AlertResult[];
}
