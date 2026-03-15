import { Controller, Get, Param, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async findAll(@Query('vehicleId') vehicleId?: string) {
    if (vehicleId) {
      return await this.alertsService.findByVehicle(vehicleId);
    }
    return await this.alertsService.findAll();
  }

  @Get(':vehicleId')
  async findByVehicle(@Param('vehicleId') vehicleId: string) {
    return await this.alertsService.findByVehicle(vehicleId);
  }
}
