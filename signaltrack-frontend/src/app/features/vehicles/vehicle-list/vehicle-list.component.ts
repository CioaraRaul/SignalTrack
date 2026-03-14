import { Component, computed } from '@angular/core';
import { fleetStore } from '../../../state/fleet.store';
import { uiStore } from '../../../state/ui.store';
import { MapService } from '../../map/map.service';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [VehicleCardComponent],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss',
})
export class VehicleListComponent {
  constructor(private mapService: MapService) {}

  filteredVehicles = computed(() => {
    const filter = uiStore.activeFilter();
    const vehicles = fleetStore.vehicles();
    if (filter === 'all') return vehicles;
    return vehicles.filter((v) => v.status === filter);
  });

  onVehicleSelected(vehicleId: string): void {
    fleetStore.selectVehicle(vehicleId);
    const vehicle = fleetStore.vehicles().find((v) => v.id === vehicleId);
    if (vehicle) {
      this.mapService.flyTo(vehicle.lat, vehicle.lng);
    }
  }
}
