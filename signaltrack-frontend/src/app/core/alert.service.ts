import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alert, AlertNotification } from '../state/models/alert.model';
import { fleetStore } from '../state/fleet.store';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly baseUrl = `${environment.apiUrl}/alerts`;
  private readonly _notifications = signal<AlertNotification[]>([]);

  readonly notifications = this._notifications.asReadonly();

  constructor(private readonly http: HttpClient) {}

  getAlerts(vehicleId?: string): Observable<Alert[]> {
    const url = vehicleId ? `${this.baseUrl}/${vehicleId}` : this.baseUrl;
    return this.http.get<Alert[]>(url);
  }

  addNotification(vehicleId: string): void {
    const vehicle = fleetStore.vehicles().find((v) => v.id === vehicleId);
    if (!vehicle) return;

    const notification: AlertNotification = {
      id: crypto.randomUUID(),
      vehicle,
      timestamp: Date.now(),
    };

    this._notifications.update((list) => [notification, ...list]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => this.dismissNotification(notification.id), 5000);
  }

  dismissNotification(id: string): void {
    this._notifications.update((list) => list.filter((n) => n.id !== id));
  }
}
