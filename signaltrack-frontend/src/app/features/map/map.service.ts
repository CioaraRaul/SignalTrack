import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Vehicle } from '../../state/models/vehicle.model';
import { createMarkerIcon } from './marker-icon.factory';
import { fleetStore } from '../../state/fleet.store';
import { uiStore } from '../../state/ui.store';

@Injectable({ providedIn: 'root' })
export class MapService {
  private map: L.Map | null = null;
  private markers = new Map<string, L.Marker>();
  private tempMarker: L.Marker | null = null;
  private mapClickHandler: ((e: L.LeafletMouseEvent) => void) | null = null;

  initMap(container: HTMLElement, center: L.LatLngExpression = [47.065, 21.925], zoom = 13): L.Map {
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
          .on('click', () => this.handleMarkerClick(vehicle.id))
          .addTo(this.map!);

        this.markers.set(vehicle.id, marker);
      }
    }
  }

  flyTo(lat: number, lng: number, zoom = 16): void {
    this.map?.flyTo([lat, lng], zoom, { duration: 1 });
  }

  getCenter(): [number, number] | null {
    if (!this.map) return null;
    const c = this.map.getCenter();
    return [c.lat, c.lng];
  }

  getZoom(): number | null {
    return this.map?.getZoom() ?? null;
  }

  restoreView(center: [number, number], zoom: number): void {
    this.map?.flyTo(center, zoom, { duration: 1 });
  }

  toggleVehicleSelection(vehicleId: string): void {
    if (fleetStore.selectedVehicleId() === vehicleId) {
      fleetStore.selectVehicle(null);
      const prev = uiStore.previousMapView();
      if (prev) {
        this.restoreView(prev.center, prev.zoom);
        uiStore.clearPreviousMapView();
      }
      return;
    }

    if (!uiStore.previousMapView()) {
      const center = this.getCenter();
      const zoom = this.getZoom();
      if (center && zoom != null) {
        uiStore.setPreviousMapView({ center, zoom });
      }
    }

    fleetStore.selectVehicle(vehicleId);
    const vehicle = fleetStore.vehicles().find((v) => v.id === vehicleId);
    if (vehicle) {
      this.flyTo(vehicle.lat, vehicle.lng);
    }
  }

  private handleMarkerClick(vehicleId: string): void {
    this.toggleVehicleSelection(vehicleId);
  }

  onMapClick(callback: (lat: number, lng: number) => void): void {
    if (!this.map) return;
    this.offMapClick();
    this.mapClickHandler = (e: L.LeafletMouseEvent) => {
      callback(e.latlng.lat, e.latlng.lng);
    };
    this.map.on('click', this.mapClickHandler);
  }

  offMapClick(): void {
    if (this.map && this.mapClickHandler) {
      this.map.off('click', this.mapClickHandler);
      this.mapClickHandler = null;
    }
  }

  addTempMarker(lat: number, lng: number): void {
    this.removeTempMarker();
    if (!this.map) return;

    const icon = L.divIcon({
      className: 'vehicle-marker',
      html: `
        <svg width="28" height="28" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="12" fill="#3b82f6" opacity="0.3">
            <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="14" cy="14" r="7" fill="#3b82f6" stroke="#fff" stroke-width="2"/>
        </svg>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    this.tempMarker = L.marker([lat, lng], { icon }).addTo(this.map);
  }

  removeTempMarker(): void {
    if (this.tempMarker) {
      this.tempMarker.remove();
      this.tempMarker = null;
    }
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
