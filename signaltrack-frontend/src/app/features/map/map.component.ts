import { Component, ElementRef, OnDestroy, OnInit, ViewChild, effect, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapService } from './map.service';
import { fleetStore } from '../../state/fleet.store';
import { uiStore } from '../../state/ui.store';
import { VehicleService } from '../../core/vehicle.service';
import { SocketService } from '../../core/socket.service';
import { AlertService } from '../../core/alert.service';
import { Vehicle } from '../../state/models/vehicle.model';
import { AddVehicleDialogComponent } from '../vehicles/add-vehicle-dialog/add-vehicle-dialog.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [AddVehicleDialogComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  private subscriptions = new Subscription();

  readonly ui = uiStore;
  readonly showDialog = signal(false);
  readonly dialogCoords = signal<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

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

  toggleAddVehicleMode(): void {
    if (uiStore.addVehicleMode()) {
      this.exitAddVehicleMode();
    } else {
      uiStore.enterAddVehicleMode();
      this.mapService.onMapClick((lat, lng) => {
        uiStore.setAddVehicleCoords(lat, lng);
        this.dialogCoords.set({ lat, lng });
        this.mapService.addTempMarker(lat, lng);
        this.mapService.offMapClick();
        this.showDialog.set(true);
      });
    }
  }

  onVehicleSaved(vehicle: Vehicle): void {
    fleetStore.addVehicle(vehicle);
    this.showDialog.set(false);
    this.exitAddVehicleMode();
  }

  onDialogCancelled(): void {
    this.showDialog.set(false);
    this.exitAddVehicleMode();
  }

  private exitAddVehicleMode(): void {
    uiStore.exitAddVehicleMode();
    this.mapService.offMapClick();
    this.mapService.removeTempMarker();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.socketService.disconnect();
    this.mapService.destroyMap();
  }
}
