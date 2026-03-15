import { Component, computed } from '@angular/core';
import { fleetStore } from '../../../state/fleet.store';
import { uiStore } from '../../../state/ui.store';
import { MapService } from '../../map/map.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';


@Component({
  selector: 'app-alert-panel',
  standalone: true,
  imports: [StatusBadgeComponent, TimeAgoPipe],
  templateUrl: './alert-panel.component.html',
  styleUrl: './alert-panel.component.scss',
})
export class AlertPanelComponent {
  readonly alerts = fleetStore.alertVehicles;
  readonly ui = uiStore;
  readonly hasAlerts = computed(() => this.alerts().length > 0);

  constructor(private mapService: MapService) {}

  onAlertClick(vehicleId: string): void {
    this.mapService.toggleVehicleSelection(vehicleId);
  }

  togglePanel(): void {
    this.ui.toggleAlertPanel();
  }
}
