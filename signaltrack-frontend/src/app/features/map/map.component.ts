import { Component, ElementRef, OnDestroy, OnInit, ViewChild, effect } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapService } from './map.service';
import { fleetStore } from '../../state/fleet.store';
import { VehicleService } from '../../core/vehicle.service';
import { SocketService } from '../../core/socket.service';
import { AlertService } from '../../core/alert.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  private subscriptions = new Subscription();

  constructor(
    private mapService: MapService,
    private vehicleService: VehicleService,
    private socketService: SocketService,
    private alertService: AlertService,
  ) {
    effect(() => {
      const vehicles = fleetStore.vehicles();
      this.mapService.syncMarkers(vehicles);
    });
  }

  ngOnInit(): void {
    this.mapService.initMap(this.mapContainer.nativeElement);

    // Load initial vehicles from REST API
    this.subscriptions.add(
      this.vehicleService.getAll().subscribe((vehicles) => {
        fleetStore.setVehicles(vehicles);
      }),
    );

    // Connect WebSocket for real-time updates
    this.socketService.connect();

    this.subscriptions.add(
      this.socketService.vehicleUpdate$.subscribe((telemetry) => {
        fleetStore.updateVehicle(telemetry.vehicleId, {
          status: telemetry.status,
          lat: telemetry.lat,
          lng: telemetry.lng,
          speed: telemetry.speed,
          fuelLevel: telemetry.fuelLevel,
          lastUpdate: telemetry.lastUpdate,
        });
      }),
    );

    this.subscriptions.add(
      this.socketService.alert$.subscribe((alertEvent) => {
        this.alertService.addNotification(alertEvent.vehicleId);
      }),
    );

    this.subscriptions.add(
      this.socketService.fleetData$.subscribe((vehicles) => {
        fleetStore.setVehicles(vehicles);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.socketService.disconnect();
    this.mapService.destroyMap();
  }
}
