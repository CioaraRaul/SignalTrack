import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertsService } from '../alerts/alerts.service';
import { TelemetryPayload } from './interfaces/telemetry-payload.interface';
import { ProcessedTelemetry } from './interfaces/processed-telemetry.interface';
import { VEHICLE_STATUS } from '../vehicles/vehicles.constants';

@Injectable()
export class FleetService {
  private readonly logger = new Logger(FleetService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly alertsService: AlertsService,
  ) {}

  async processTelemetry(
    payload: TelemetryPayload,
  ): Promise<ProcessedTelemetry> {
    const alerts = this.alertsService.evaluateTelemetry({
      speed: payload.speed,
      fuelLevel: payload.fuelLevel,
    });

    const status =
      alerts.length > 0
        ? VEHICLE_STATUS.ALERT
        : payload.speed > 0
          ? VEHICLE_STATUS.MOVING
          : VEHICLE_STATUS.IDLE;

    const vehicle = await this.prisma.vehicle.update({
      where: { id: payload.vehicleId },
      data: {
        lat: payload.lat,
        lng: payload.lng,
        speed: payload.speed,
        fuelLevel: payload.fuelLevel,
        status,
        lastUpdate: new Date(),
      },
    });

    await Promise.all(
      alerts.map((alert) => {
        this.logger.warn(
          `Alert [${alert.type}]: Vehicle ${payload.vehicleId} — value ${alert.value} exceeds threshold ${alert.threshold}`,
        );
        return this.alertsService.saveAlert(payload.vehicleId, alert);
      }),
    );

    return {
      vehicleId: vehicle.id,
      status: vehicle.status,
      lat: vehicle.lat,
      lng: vehicle.lng,
      speed: vehicle.speed,
      fuelLevel: vehicle.fuelLevel,
      lastUpdate: vehicle.lastUpdate,
      alerts,
    };
  }

  async getAllVehicles() {
    return await this.prisma.vehicle.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }
}
