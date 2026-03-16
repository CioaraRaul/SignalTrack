import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FleetGateway } from './fleet.gateway';
import { FleetService } from './fleet.service';
import { VEHICLE_STATUS } from '../vehicles/vehicles.constants';
import {
  SIMULATION_TICK_MS,
  FUEL_DRAIN_FACTOR,
  EARTH_DEG_PER_KM,
} from './fleet.constants';

@Injectable()
export class FleetSimulationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FleetSimulationService.name);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly fleetService: FleetService,
    private readonly fleetGateway: FleetGateway,
  ) {}

  onModuleInit() {
    this.logger.log(
      `Starting fleet simulation (tick every ${SIMULATION_TICK_MS}ms)`,
    );
    this.intervalId = setInterval(() => this.tick(), SIMULATION_TICK_MS);
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async tick(): Promise<void> {
    try {
      const vehicles = await this.prisma.vehicle.findMany({
        where: {
          status: { in: [VEHICLE_STATUS.MOVING, VEHICLE_STATUS.ALERT] },
        },
      });

      for (const vehicle of vehicles) {
        const speedKmh = vehicle.speed;

        // Movement: small random offset based on speed
        const distKm = (speedKmh / 3600) * (SIMULATION_TICK_MS / 1000);
        const angle = Math.random() * 2 * Math.PI;
        const offsetDeg = distKm * EARTH_DEG_PER_KM;
        const newLat = vehicle.lat + Math.cos(angle) * offsetDeg;
        const newLng = vehicle.lng + Math.sin(angle) * offsetDeg;

        // Fuel decreases proportional to speed
        const fuelDrain = speedKmh * FUEL_DRAIN_FACTOR;
        const newFuel = Math.max(0, vehicle.fuelLevel - fuelDrain);

        // Send through the existing telemetry pipeline
        const result = await this.fleetService.processTelemetry({
          vehicleId: vehicle.id,
          lat: newLat,
          lng: newLng,
          speed: speedKmh,
          fuelLevel: parseFloat(newFuel.toFixed(1)),
        });

        // Broadcast to all connected clients
        this.fleetGateway.server.emit('vehicleUpdate', result);

        if (result.alerts.length > 0) {
          this.fleetGateway.server.emit('alert', {
            vehicleId: result.vehicleId,
            alerts: result.alerts,
          });
        }
      }
    } catch (err) {
      this.logger.error('Simulation tick failed', (err as Error).stack);
    }
  }
}
