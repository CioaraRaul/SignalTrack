import { Vehicle } from './vehicle.model';

export interface AlertNotification {
  id: string;
  vehicle: Vehicle;
  timestamp: number;
}
