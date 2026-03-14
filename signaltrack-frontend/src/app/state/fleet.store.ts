import { signal, computed } from '@angular/core';
import { Vehicle } from './models/vehicle.model';

const _vehicles = signal<Vehicle[]>([]);
const _selectedVehicleId = signal<string | null>(null);

export const fleetStore = {
  vehicles: _vehicles.asReadonly(),
  selectedVehicleId: _selectedVehicleId.asReadonly(),

  selectedVehicle: computed(() => {
    const id = _selectedVehicleId();
    return _vehicles().find((v) => v.id === id) ?? null;
  }),

  movingCount: computed(() => _vehicles().filter((v) => v.status === 'moving').length),
  idleCount: computed(() => _vehicles().filter((v) => v.status === 'idle').length),
  offlineCount: computed(() => _vehicles().filter((v) => v.status === 'offline').length),
  alertCount: computed(() => _vehicles().filter((v) => v.status === 'alert').length),

  setVehicles(vehicles: Vehicle[]) {
    _vehicles.set(vehicles);
  },

  updateVehicle(id: string, patch: Partial<Vehicle>) {
    _vehicles.update((list) => list.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  },

  selectVehicle(id: string | null) {
    _selectedVehicleId.set(id);
  },
};
