import { AlertResult } from '../../alerts/interfaces/alert-result.interface';

export interface ProcessedTelemetry {
  vehicleId: string;
  status: string;
  lat: number;
  lng: number;
  speed: number;
  fuelLevel: number;
  lastUpdate: Date;
  alerts: AlertResult[];
}
