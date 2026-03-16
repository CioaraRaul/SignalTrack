import { Component, input, output, computed, signal } from '@angular/core';
import { Vehicle } from '../../../state/models/vehicle.model';
import { fleetStore } from '../../../state/fleet.store';
import { VehicleService } from '../../../core/vehicle.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { FuelBarComponent } from '../../../shared/components/fuel-bar/fuel-bar.component';
import { SpeedFormatPipe } from '../../../shared/pipes/speed-format.pipe';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { EditVehicleDialogComponent } from '../edit-vehicle-dialog/edit-vehicle-dialog.component';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [
    StatusBadgeComponent,
    FuelBarComponent,
    SpeedFormatPipe,
    TimeAgoPipe,
    EditVehicleDialogComponent,
  ],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss',
})
export class VehicleCardComponent {
  vehicle = input.required<Vehicle>();
  selected = output<string>();
  deleted = output<string>();

  editing = signal(false);

  isSelected = computed(() => fleetStore.selectedVehicleId() === this.vehicle().id);
  deleting = signal(false);
  confirmingDelete = signal(false);

  constructor(private vehicleService: VehicleService) {}

  onClick(): void {
    this.selected.emit(this.vehicle().id);
  }

  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.confirmingDelete.set(true);
  }

  onConfirmDelete(event: MouseEvent): void {
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
        this.confirmingDelete.set(false);
      },
    });
  }

  onCancelDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.confirmingDelete.set(false);
  }

  onEditClick(event: MouseEvent): void {
    event.stopPropagation();
    this.editing.set(true);
  }

  onEditSaved(updated: Vehicle): void {
    fleetStore.updateVehicle(updated.id, updated);
    this.editing.set(false);
  }

  onEditCancelled(): void {
    this.editing.set(false);
  }
}
