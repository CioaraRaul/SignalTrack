import { Component } from '@angular/core';
import { VehicleListComponent } from '../../features/vehicles/vehicle-list/vehicle-list.component';
import { fleetStore } from '../../state/fleet.store';
import { uiStore } from '../../state/ui.store';
import { VehicleStatus } from '../../state/models/vehicle.model';

@Component({
  selector: 'app-sidebar-shell',
  standalone: true,
  imports: [VehicleListComponent],
  templateUrl: './sidebar-shell.component.html',
  styleUrl: './sidebar-shell.component.scss',
})
export class SidebarShellComponent {
  readonly store = fleetStore;
  readonly ui = uiStore;

  readonly filters: { label: string; value: VehicleStatus | 'all' }[] = [
    { label: 'Toate', value: 'all' },
    { label: 'În mișcare', value: 'moving' },
    { label: 'Staționar', value: 'idle' },
    { label: 'Alertă', value: 'alert' },
    { label: 'Offline', value: 'offline' },
  ];

  getCount(value: VehicleStatus | 'all'): number {
    if (value === 'all') return this.store.vehicles().length;
    if (value === 'moving') return this.store.movingCount();
    if (value === 'idle') return this.store.idleCount();
    if (value === 'alert') return this.store.alertCount();
    return this.store.offlineCount();
  }

  setFilter(value: VehicleStatus | 'all'): void {
    this.ui.setFilter(value);
  }

  toggleSidebar(): void {
    this.ui.toggleSidebar();
  }
}
