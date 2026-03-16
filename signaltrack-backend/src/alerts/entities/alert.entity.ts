import { ApiProperty } from '@nestjs/swagger';

export class AlertEntity {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'uuid-vehicle-id' })
  vehicleId!: string;

  @ApiProperty({ enum: ['speed', 'fuel'], example: 'speed' })
  type!: string;

  @ApiProperty({ example: 135 })
  value!: number;

  @ApiProperty({ example: 120 })
  threshold!: number;

  @ApiProperty()
  createdAt!: Date;
}
