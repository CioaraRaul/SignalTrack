export type VehicleStatus = 'moving' | 'idle' | 'offline' | 'alert';

export interface Vehicle {
  id: string;
  plateNumber: string;
  driverName: string;
  status: VehicleStatus;
  speed: number;
  fuelLevel: number;
  lat: number;
  lng: number;
  lastUpdate: string;
}
