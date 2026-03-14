import { Component, computed, input } from '@angular/core';
import { VehicleStatus } from '../../../state/models/vehicle.model';
import { STATUS_COLORS, STATUS_LABELS } from '../../../state/fleet.constants';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  status = input.required<VehicleStatus>();

  color = computed(() => STATUS_COLORS[this.status()]);
  label = computed(() => STATUS_LABELS[this.status()]);
}
