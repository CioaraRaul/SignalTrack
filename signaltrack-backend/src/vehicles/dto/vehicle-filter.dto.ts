import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VEHICLE_STATUSES } from '../vehicles.constants';
import type { VehicleStatus } from '../interfaces/vehicle-status.interface';

export class VehicleFilterDto {
  @ApiPropertyOptional({ enum: ['idle', 'moving', 'alert', 'offline'], description: 'Filter by vehicle status' })
  @IsOptional()
  @IsEnum(VEHICLE_STATUSES)
  status?: VehicleStatus;
}
