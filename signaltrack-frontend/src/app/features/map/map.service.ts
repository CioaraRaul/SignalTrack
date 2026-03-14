import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Vehicle } from '../../state/models/vehicle.model';
import { createMarkerIcon } from './marker-icon.factory';
import { fleetStore } from '../../state/fleet.store';

@Injectable({ providedIn: 'root' })
export class MapService {
  private map: L.Map | null = null;
  private markers = new Map<string, L.Marker>();

  initMap(
    container: HTMLElement,
    center: L.LatLngExpression = [47.0722, 21.9213],
    zoom = 13,
  ): L.Map {
    this.map = L.map(container, { center, zoom, zoomControl: true });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    return this.map;
  }

  syncMarkers(vehicles: Vehicle[]): void {
    if (!this.map) return;

    const currentIds = new Set(vehicles.map((v) => v.id));

    // Remove markers for vehicles no longer in the list
    for (const [id, marker] of this.markers) {
      if (!currentIds.has(id)) {
        marker.remove();
        this.markers.delete(id);
      }
    }

    // Add or update markers
    for (const vehicle of vehicles) {
      const existing = this.markers.get(vehicle.id);

      if (existing) {
        existing.setLatLng([vehicle.lat, vehicle.lng]);
        existing.setIcon(createMarkerIcon(vehicle.status));
        existing.setPopupContent(this.buildPopup(vehicle));
      } else {
        const marker = L.marker([vehicle.lat, vehicle.lng], {
          icon: createMarkerIcon(vehicle.status),
        })
          .bindPopup(this.buildPopup(vehicle))
          .on('click', () => fleetStore.selectVehicle(vehicle.id))
          .addTo(this.map!);

        this.markers.set(vehicle.id, marker);
      }
    }
  }

  flyTo(lat: number, lng: number, zoom = 16): void {
    this.map?.flyTo([lat, lng], zoom, { duration: 1 });
  }

  destroyMap(): void {
    this.map?.remove();
    this.map = null;
    this.markers.clear();
  }

  private buildPopup(vehicle: Vehicle): string {
    return `
      <div style="font-family: sans-serif; min-width: 160px;">
        <strong>${vehicle.plateNumber}</strong><br/>
        <span style="color: #666;">${vehicle.driverName}</span><br/>
        <hr style="margin: 4px 0; border: none; border-top: 1px solid #eee;"/>
        <span>Viteză: <strong>${vehicle.speed} km/h</strong></span><br/>
        <span>Combustibil: <strong>${vehicle.fuelLevel}%</strong></span><br/>
        <span>Status: <strong>${vehicle.status}</strong></span>
      </div>
    `;
  }
}
