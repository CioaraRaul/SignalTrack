import { Component, input, output, computed, signal } from '@angular/core';
import { Vehicle } from '../../../state/models/vehicle.model';
import { fleetStore } from '../../../state/fleet.store';
import { VehicleService } from '../../../core/vehicle.service';
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
  deleted = output<string>();

  isSelected = computed(() => fleetStore.selectedVehicleId() === this.vehicle().id);
  deleting = signal(false);

  constructor(private vehicleService: VehicleService) {}

  onClick(): void {
    this.selected.emit(this.vehicle().id);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    if (this.deleting()) return;

    this.deleting.set(true);
    this.vehicleService.delete(this.vehicle().id).subscribe({
      next: () => {
        fleetStore.removeVehicle(this.vehicle().id);
        this.deleted.emit(this.vehicle().id);
      },
      error: () => {
        this.deleting.set(false);
      },
    });
  }
}
