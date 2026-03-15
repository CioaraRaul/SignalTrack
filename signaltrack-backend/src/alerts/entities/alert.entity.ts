import { AlertType } from '../interfaces/alert-result.interface';

export class AlertEntity {
  id!: string;
  vehicleId!: string;
  type!: AlertType;
  value!: number;
  threshold!: number;
  createdAt!: Date;
}
