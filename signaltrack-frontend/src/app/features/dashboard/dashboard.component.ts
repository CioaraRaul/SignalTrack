import { Component, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { fleetStore } from '../../state/fleet.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly store = fleetStore;

  totalVehicles = computed(() => this.store.vehicles().length);

  avgSpeed = computed(() => {
    const vehicles = this.store.vehicles();
    if (!vehicles.length) return 0;
    const sum = vehicles.reduce((acc, v) => acc + v.speed, 0);
    return Math.round(sum / vehicles.length);
  });

  avgFuel = computed(() => {
    const vehicles = this.store.vehicles();
    if (!vehicles.length) return 0;
    const sum = vehicles.reduce((acc, v) => acc + v.fuelLevel, 0);
    return Math.round(sum / vehicles.length);
  });

  lowFuelVehicles = computed(() => this.store.vehicles().filter((v) => v.fuelLevel < 20));
}
