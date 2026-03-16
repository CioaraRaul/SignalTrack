import { IsString, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { AlertType } from '../interfaces/alert-result.interface';

export class CreateAlertDto {
  @ApiProperty({ example: 'uuid-vehicle-id', description: 'Vehicle UUID' })
  @IsString()
  vehicleId!: string;

  @ApiProperty({ enum: ['speed', 'fuel'], example: 'speed', description: 'Alert type' })
  @IsEnum(['speed', 'fuel'])
  type!: AlertType;

  @ApiProperty({ example: 135, description: 'Measured value that triggered the alert' })
  @IsNumber()
  value!: number;

  @ApiProperty({ example: 120, description: 'Threshold value for the alert' })
  @IsNumber()
  threshold!: number;
}
