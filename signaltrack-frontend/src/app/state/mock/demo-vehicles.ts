import { Vehicle } from '../models/vehicle.model';

export const DEMO_VEHICLES: Vehicle[] = [
  {
    id: '1',
    plateNumber: 'BH-101-ABC',
    driverName: 'Ion Popescu',
    status: 'moving',
    speed: 67,
    fuelLevel: 82,
    lat: 47.0722, // Piața Unirii
    lng: 21.9213,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '2',
    plateNumber: 'BH-202-DEF',
    driverName: 'Maria Ionescu',
    status: 'idle',
    speed: 0,
    fuelLevel: 45,
    lat: 47.0612, // Rogerius
    lng: 21.9389,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '3',
    plateNumber: 'BH-303-GHI',
    driverName: 'Andrei Vasile',
    status: 'alert',
    speed: 120,
    fuelLevel: 15,
    lat: 47.0501, // Ioșia
    lng: 21.9102,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '4',
    plateNumber: 'BH-404-JKL',
    driverName: 'Elena Dumitrescu',
    status: 'offline',
    speed: 0,
    fuelLevel: 60,
    lat: 47.0831, // Nufărul
    lng: 21.9334,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '5',
    plateNumber: 'BH-505-MNO',
    driverName: 'Vlad Stănescu',
    status: 'moving',
    speed: 45,
    fuelLevel: 91,
    lat: 47.0465, // Velența
    lng: 21.9587,
    lastUpdate: new Date().toISOString(),
  },
];
