import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type { Alert } from '@prisma/client';
import { AlertResult } from './interfaces/alert-result.interface';
import {
  DEFAULT_ALERT_SPEED_THRESHOLD,
  DEFAULT_ALERT_FUEL_THRESHOLD,
} from '../config/config.constants';

@Injectable()
export class AlertsService {
  private readonly speedThreshold: number;
  private readonly fuelThreshold: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.speedThreshold = this.config.get<number>(
      'app.alertSpeedThreshold',
      DEFAULT_ALERT_SPEED_THRESHOLD,
    );
    this.fuelThreshold = this.config.get<number>(
      'app.alertFuelThreshold',
      DEFAULT_ALERT_FUEL_THRESHOLD,
    );
  }

  evaluateTelemetry(vehicle: {
    speed: number;
    fuelLevel: number;
  }): AlertResult[] {
    const alerts: AlertResult[] = [];

    if (vehicle.speed > this.speedThreshold) {
      alerts.push({
        type: 'speed',
        value: vehicle.speed,
        threshold: this.speedThreshold,
      });
    }

    if (vehicle.fuelLevel < this.fuelThreshold) {
      alerts.push({
        type: 'fuel',
        value: vehicle.fuelLevel,
        threshold: this.fuelThreshold,
      });
    }

    return alerts;
  }

  async saveAlert(vehicleId: string, alert: AlertResult): Promise<Alert> {
    return await this.prisma.alert.create({
      data: {
        vehicleId,
        type: alert.type,
        value: alert.value,
        threshold: alert.threshold,
      },
    });
  }

  async findAll(): Promise<Alert[]> {
    return await this.prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByVehicle(vehicleId: string): Promise<Alert[]> {
    return await this.prisma.alert.findMany({
      where: { vehicleId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
