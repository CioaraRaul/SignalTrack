import { IsString, IsEnum, IsNumber } from 'class-validator';
import type { AlertType } from '../interfaces/alert-result.interface';

export class CreateAlertDto {
  @IsString()
  vehicleId!: string;

  @IsEnum(['speed', 'fuel'])
  type!: AlertType;

  @IsNumber()
  value!: number;

  @IsNumber()
  threshold!: number;
}
