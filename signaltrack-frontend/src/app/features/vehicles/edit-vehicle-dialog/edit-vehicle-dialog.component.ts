import { Component, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehicle, VehicleStatus } from '../../../state/models/vehicle.model';
import { VehicleService } from '../../../core/vehicle.service';
import { STATUS_LABELS } from '../../../state/fleet.constants';
import { UpdateVehicleDto } from '../../../state/models/vehicle-dto.model';

@Component({
  selector: 'app-edit-vehicle-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-vehicle-dialog.component.html',
  styleUrl: '../add-vehicle-dialog/add-vehicle-dialog.component.scss',
})
export class EditVehicleDialogComponent implements OnInit {
  vehicle = input.required<Vehicle>();
  saved = output<Vehicle>();
  cancelled = output<void>();

  form!: FormGroup;
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
  ) {}

  ngOnInit(): void {
    const v = this.vehicle();
    this.form = this.fb.group({
      plateNumber: [v.plateNumber, Validators.required],
      driverName: [v.driverName, Validators.required],
      status: [v.status as VehicleStatus],
      speed: [v.speed, [Validators.required, Validators.min(0)]],
      fuelLevel: [v.fuelLevel, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    this.errorMessage = '';

    const dto: UpdateVehicleDto = this.form.value;

    this.vehicleService.update(this.vehicle().id, dto).subscribe({
      next: (vehicle) => {
        this.submitting = false;
        this.saved.emit(vehicle);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.message || 'A apărut o eroare la actualizare.';
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
