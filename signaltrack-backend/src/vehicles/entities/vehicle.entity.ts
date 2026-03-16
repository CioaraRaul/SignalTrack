import { ApiProperty } from '@nestjs/swagger';

export class Vehicle {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'B-101-ABC' })
  plateNumber!: string;

  @ApiProperty({ example: 'Ion Popescu' })
  driverName!: string;

  @ApiProperty({ enum: ['idle', 'moving', 'alert', 'offline'], example: 'idle' })
  status!: string;

  @ApiProperty({ example: 60 })
  speed!: number;

  @ApiProperty({ example: 85 })
  fuelLevel!: number;

  @ApiProperty({ example: 44.4268 })
  lat!: number;

  @ApiProperty({ example: 26.1025 })
  lng!: number;

  @ApiProperty()
  lastUpdate!: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
