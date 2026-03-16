import { Component, computed, OnInit } from '@angular/core';
import { fleetStore } from '../../../state/fleet.store';
import { uiStore } from '../../../state/ui.store';
import { MapService } from '../../map/map.service';
import { AlertService } from '../../../core/alert.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { Alert } from '../../../state/models/alert.model';

@Component({
  selector: 'app-alert-panel',
  standalone: true,
  imports: [StatusBadgeComponent, TimeAgoPipe],
  templateUrl: './alert-panel.component.html',
  styleUrl: './alert-panel.component.scss',
})
export class AlertPanelComponent implements OnInit {
  readonly alerts = fleetStore.alertVehicles;
  readonly ui = uiStore;
  readonly hasAlerts = computed(() => this.alerts().length > 0);

  recentAlerts: Alert[] = [];

  constructor(
    private mapService: MapService,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.alertService.getAlerts().subscribe((alerts) => {
      this.recentAlerts = alerts;
    });
  }

  onAlertClick(vehicleId: string): void {
    this.mapService.toggleVehicleSelection(vehicleId);
  }

  togglePanel(): void {
    this.ui.toggleAlertPanel();
  }
}
