import { IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VEHICLE_STATUSES } from '../vehicles.constants';
import type { VehicleStatus } from '../interfaces/vehicle-status.interface';

export class CreateVehicleDto {
  @ApiProperty({ example: 'B-101-ABC', description: 'Vehicle plate number' })
  @IsString()
  plateNumber!: string;

  @ApiProperty({ example: 'Ion Popescu', description: 'Driver full name' })
  @IsString()
  driverName!: string;

  @ApiProperty({ enum: ['idle', 'moving', 'alert', 'offline'], example: 'idle', description: 'Current vehicle status' })
  @IsEnum(VEHICLE_STATUSES)
  status!: VehicleStatus;

  @ApiProperty({ example: 60, description: 'Current speed in km/h', minimum: 0 })
  @IsNumber()
  @Min(0)
  speed!: number;

  @ApiProperty({ example: 85, description: 'Fuel level percentage', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  fuelLevel!: number;

  @ApiProperty({ example: 44.4268, description: 'Latitude coordinate' })
  @IsNumber()
  lat!: number;

  @ApiProperty({ example: 26.1025, description: 'Longitude coordinate' })
  @IsNumber()
  lng!: number;
}
