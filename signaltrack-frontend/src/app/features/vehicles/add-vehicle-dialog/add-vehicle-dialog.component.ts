import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Vehicle, VehicleStatus } from '../../../state/models/vehicle.model';
import { VehicleService } from '../../../core/vehicle.service';
import { STATUS_LABELS } from '../../../state/fleet.constants';
import { CreateVehicleDto } from '../../../state/models/vehicle-dto.model';

@Component({
  selector: 'app-add-vehicle-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './add-vehicle-dialog.component.html',
  styleUrl: './add-vehicle-dialog.component.scss',
})
export class AddVehicleDialogComponent {
  coords = input.required<{ lat: number; lng: number }>();
  saved = output<Vehicle>();
  cancelled = output<void>();

  form: FormGroup;
  submitting = false;
  errorMessage = '';

  readonly statusOptions: { value: VehicleStatus; label: string }[] = [
    { value: 'idle', label: STATUS_LABELS['idle'] },
    { value: 'moving', label: STATUS_LABELS['moving'] },
    { value: 'offline', label: STATUS_LABELS['offline'] },
    { value: 'alert', label: STATUS_LABELS['alert'] },
  ];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
  ) {
    this.form = this.fb.group({
      plateNumber: ['', Validators.required],
      driverName: ['', Validators.required],
      status: ['idle' as VehicleStatus],
      speed: [0, [Validators.required, Validators.min(0)]],
      fuelLevel: [100, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    this.errorMessage = '';

    const dto: CreateVehicleDto = {
      ...this.form.value,
      lat: this.coords().lat,
      lng: this.coords().lng,
    };

    this.vehicleService.create(dto).subscribe({
      next: (vehicle) => {
        this.submitting = false;
        this.saved.emit(vehicle);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.message || 'A apărut o eroare la crearea vehiculului.';
      },
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-backdrop')) {
      this.onCancel();
    }
  }
}
