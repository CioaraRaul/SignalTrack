import { IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { VEHICLE_STATUSES } from '../vehicles.constants';
import type { VehicleStatus } from '../interfaces/vehicle-status.interface';

export class CreateVehicleDto {
  @IsString()
  plateNumber!: string;

  @IsString()
  driverName!: string;

  @IsEnum(VEHICLE_STATUSES)
  status!: VehicleStatus;

  @IsNumber()
  @Min(0)
  speed!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  fuelLevel!: number;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;
}
