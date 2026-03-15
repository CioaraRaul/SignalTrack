import { signal } from '@angular/core';
import { VehicleStatus } from './models/vehicle.model';
import { MapView } from './models/map-view.model';

const _sidebarOpen = signal(true);
const _activeFilter = signal<VehicleStatus | 'all'>('all');
const _mapZoom = signal(13);
const _alertPanelOpen = signal(true);
const _previousMapView = signal<MapView | null>(null);

export const uiStore = {
  sidebarOpen: _sidebarOpen.asReadonly(),
  activeFilter: _activeFilter.asReadonly(),
  mapZoom: _mapZoom.asReadonly(),
  alertPanelOpen: _alertPanelOpen.asReadonly(),
  previousMapView: _previousMapView.asReadonly(),

  toggleSidebar() {
    _sidebarOpen.update((v) => !v);
  },

  setFilter(status: VehicleStatus | 'all') {
    _activeFilter.set(status);
  },

  setMapZoom(zoom: number) {
    _mapZoom.set(zoom);
  },

  toggleAlertPanel() {
    _alertPanelOpen.update((v) => !v);
  },

  setPreviousMapView(view: MapView) {
    _previousMapView.set(view);
  },

  clearPreviousMapView() {
    _previousMapView.set(null);
  },
};
