import { Component, signal, effect } from '@angular/core';
import { fleetStore } from '../../../state/fleet.store';
import { Vehicle } from '../../../state/models/vehicle.model';
import { AlertNotification } from '../../../state/models/alert.model';

@Component({
  selector: 'app-alert-toast',
  standalone: true,
  templateUrl: './alert-toast.component.html',
  styleUrl: './alert-toast.component.scss',
})
export class AlertToastComponent {
  notifications = signal<AlertNotification[]>([]);
  private previousAlertIds = new Set<string>();

  constructor() {
    effect(() => {
      const alertVehicles = fleetStore.alertVehicles();
      const currentAlertIds = new Set(alertVehicles.map((v) => v.id));

      for (const vehicle of alertVehicles) {
        if (!this.previousAlertIds.has(vehicle.id)) {
          this.addNotification(vehicle);
        }
      }

      this.previousAlertIds = currentAlertIds;
    });
  }

  private addNotification(vehicle: Vehicle): void {
    const notification: AlertNotification = {
      id: `${vehicle.id}-${Date.now()}`,
      vehicle,
      timestamp: Date.now(),
    };

    this.notifications.update((list) => [notification, ...list]);

    setTimeout(() => this.dismiss(notification.id), 5000);
  }

  dismiss(notificationId: string): void {
    this.notifications.update((list) => list.filter((n) => n.id !== notificationId));
  }
}
