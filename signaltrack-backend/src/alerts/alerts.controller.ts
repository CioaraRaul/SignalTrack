import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { AlertEntity } from './entities/alert.entity';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all alerts (optionally filter by vehicle)' })
  @ApiQuery({ name: 'vehicleId', required: false, description: 'Filter alerts by vehicle UUID' })
  @ApiResponse({ status: 200, description: 'List of alerts', type: [AlertEntity] })
  async findAll(@Query('vehicleId') vehicleId?: string) {
    if (vehicleId) {
      return await this.alertsService.findByVehicle(vehicleId);
    }
    return await this.alertsService.findAll();
  }

  @Get(':vehicleId')
  @ApiOperation({ summary: 'Get alerts for a specific vehicle' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'List of alerts for the vehicle', type: [AlertEntity] })
  async findByVehicle(@Param('vehicleId') vehicleId: string) {
    return await this.alertsService.findByVehicle(vehicleId);
  }
}
