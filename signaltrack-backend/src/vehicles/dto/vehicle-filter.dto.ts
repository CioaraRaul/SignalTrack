import { IsOptional, IsEnum } from 'class-validator';
import { VEHICLE_STATUSES } from '../vehicles.constants';
import type { VehicleStatus } from '../interfaces/vehicle-status.interface';

export class VehicleFilterDto {
  @IsOptional()
  @IsEnum(VEHICLE_STATUSES)
  status?: VehicleStatus;
}
