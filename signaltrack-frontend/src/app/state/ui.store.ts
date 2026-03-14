import { signal } from '@angular/core';
import { VehicleStatus } from './models/vehicle.model';

const _sidebarOpen = signal(true);
const _activeFilter = signal<VehicleStatus | 'all'>('all');
const _mapZoom = signal(13);

export const uiStore = {
  sidebarOpen: _sidebarOpen.asReadonly(),
  activeFilter: _activeFilter.asReadonly(),
  mapZoom: _mapZoom.asReadonly(),

  toggleSidebar() {
    _sidebarOpen.update((v) => !v);
  },

  setFilter(status: VehicleStatus | 'all') {
    _activeFilter.set(status);
  },

  setMapZoom(zoom: number) {
    _mapZoom.set(zoom);
  },
};
