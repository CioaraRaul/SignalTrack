import { VehicleStatus } from './vehicle.model';

export interface CreateVehicleDto {
  plateNumber: string;
  driverName: string;
  status: VehicleStatus;
  speed: number;
  fuelLevel: number;
  lat: number;
  lng: number;
}

export type UpdateVehicleDto = Partial<CreateVehicleDto>;
