import { Component, input, output, computed } from '@angular/core';
import { Vehicle } from '../../../state/models/vehicle.model';
import { fleetStore } from '../../../state/fleet.store';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { FuelBarComponent } from '../../../shared/components/fuel-bar/fuel-bar.component';
import { SpeedFormatPipe } from '../../../shared/pipes/speed-format.pipe';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [StatusBadgeComponent, FuelBarComponent, SpeedFormatPipe, TimeAgoPipe],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss',
})
export class VehicleCardComponent {
  vehicle = input.required<Vehicle>();
  selected = output<string>();

  isSelected = computed(() => fleetStore.selectedVehicleId() === this.vehicle().id);

  onClick(): void {
    this.selected.emit(this.vehicle().id);
  }
}
