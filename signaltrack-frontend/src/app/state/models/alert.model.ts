import { Vehicle } from './vehicle.model';

export interface Alert {
  id: string;
  vehicleId: string;
  type: 'speed' | 'fuel';
  value: number;
  threshold: number;
  createdAt: string;
}

export interface AlertNotification {
  id: string;
  vehicle: Vehicle;
  timestamp: number;
}
