import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-fuel-bar',
  standalone: true,
  templateUrl: './fuel-bar.component.html',
  styleUrl: './fuel-bar.component.scss',
})
export class FuelBarComponent {
  level = input.required<number>();

  barColor = computed(() => {
    const l = this.level();
    if (l > 50) return '#22c55e';
    if (l > 25) return '#eab308';
    return '#ef4444';
  });
}
