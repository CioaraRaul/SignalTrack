import { Injectable, signal, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import {
  ProcessedTelemetry,
  AlertEvent,
  TelemetryPayload,
} from '../state/models/socket-event.model';
import { Vehicle } from '../state/models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: Socket | null = null;

  readonly connected = signal(false);

  private readonly _vehicleUpdate$ = new Subject<ProcessedTelemetry>();
  private readonly _alert$ = new Subject<AlertEvent>();
  private readonly _fleetData$ = new Subject<Vehicle[]>();

  readonly vehicleUpdate$ = this._vehicleUpdate$.asObservable();
  readonly alert$ = this._alert$.asObservable();
  readonly fleetData$ = this._fleetData$.asObservable();

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(environment.wsUrl, {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => this.connected.set(true));
    this.socket.on('disconnect', () => this.connected.set(false));

    this.socket.on('vehicleUpdate', (data: ProcessedTelemetry) => {
      this._vehicleUpdate$.next(data);
    });

    this.socket.on('alert', (data: AlertEvent) => {
      this._alert$.next(data);
    });

    this.socket.on('fleetData', (data: Vehicle[]) => {
      this._fleetData$.next(data);
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.connected.set(false);
  }

  requestFleet(): void {
    this.socket?.emit('requestFleet');
  }

  sendTelemetry(payload: TelemetryPayload): void {
    this.socket?.emit('telemetry', payload);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
