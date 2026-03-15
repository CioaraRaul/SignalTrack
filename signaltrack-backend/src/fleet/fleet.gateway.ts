import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { FleetService } from './fleet.service';
import type { TelemetryPayload } from './interfaces/telemetry-payload.interface';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:4200',
  },
})
export class FleetGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(FleetGateway.name);

  constructor(private readonly fleetService: FleetService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('telemetry')
  async handleTelemetry(client: Socket, payload: TelemetryPayload) {
    const result = await this.fleetService.processTelemetry(payload);

    // Broadcast vehicle update to all clients
    this.server.emit('vehicleUpdate', result);

    // If there are alerts, emit a separate alert event
    if (result.alerts.length > 0) {
      this.server.emit('alert', {
        vehicleId: result.vehicleId,
        alerts: result.alerts,
      });
    }

    return result;
  }

  @SubscribeMessage('requestFleet')
  async handleRequestFleet() {
    const vehicles = await this.fleetService.getAllVehicles();
    return { event: 'fleetData', data: vehicles };
  }
}
