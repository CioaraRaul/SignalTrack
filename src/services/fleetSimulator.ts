import type { Vehicle, Alert, AlertType, AlertSeverity, VehicleStatus, GeoLocation } from '../types';

// Central Europe bounding box for realistic truck routes
const ROUTE_WAYPOINTS: Record<string, GeoLocation[]> = {
  'Berlin-Munich': [
    { lat: 52.52, lng: 13.405 },
    { lat: 51.34, lng: 12.375 },
    { lat: 50.775, lng: 11.023 },
    { lat: 48.137, lng: 11.576 },
  ],
  'Hamburg-Frankfurt': [
    { lat: 53.551, lng: 9.993 },
    { lat: 52.374, lng: 9.738 },
    { lat: 51.96, lng: 8.872 },
    { lat: 50.11, lng: 8.682 },
  ],
  'Munich-Vienna': [
    { lat: 48.137, lng: 11.576 },
    { lat: 47.8, lng: 13.04 },
    { lat: 48.208, lng: 16.373 },
  ],
  'Cologne-Berlin': [
    { lat: 50.938, lng: 6.96 },
    { lat: 51.513, lng: 7.465 },
    { lat: 52.22, lng: 10.54 },
    { lat: 52.52, lng: 13.405 },
  ],
  'Hamburg-Warsaw': [
    { lat: 53.551, lng: 9.993 },
    { lat: 53.427, lng: 14.553 },
    { lat: 52.23, lng: 21.012 },
  ],
  'Munich-Prague': [
    { lat: 48.137, lng: 11.576 },
    { lat: 48.564, lng: 13.45 },
    { lat: 50.075, lng: 14.437 },
  ],
};

const DRIVERS = [
  'Klaus Müller', 'Hans Weber', 'Stefan Fischer', 'Wolfgang Schmidt',
  'Thomas Bauer', 'Andreas Richter', 'Markus Hoffmann', 'Jürgen Wagner',
  'Peter Zimmermann', 'Martin Krause', 'Frank Lehmann', 'Dieter Koch',
];

const CARGO_TYPES = [
  'Electronics', 'Automotive Parts', 'Food & Beverages', 'Pharmaceuticals',
  'Machinery', 'Textiles', 'Chemical Goods', 'Construction Materials',
];

const STATUS_WEIGHTS: [VehicleStatus, number][] = [
  ['active', 60],
  ['idle', 20],
  ['maintenance', 8],
  ['offline', 7],
  ['alert', 5],
];

function weightedRandom<T>(items: [T, number][]): T {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [item, weight] of items) {
    r -= weight;
    if (r <= 0) return item;
  }
  return items[0][0];
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function interpolatePosition(waypoints: GeoLocation[], t: number): GeoLocation {
  if (waypoints.length === 1) return waypoints[0];
  const segments = waypoints.length - 1;
  const segment = Math.min(Math.floor(t * segments), segments - 1);
  const segmentT = t * segments - segment;
  const a = waypoints[segment];
  const b = waypoints[segment + 1];
  return {
    lat: a.lat + (b.lat - a.lat) * segmentT,
    lng: a.lng + (b.lng - a.lng) * segmentT,
  };
}

function computeHeading(from: GeoLocation, to: GeoLocation): number {
  const dLng = to.lng - from.lng;
  const dLat = to.lat - from.lat;
  const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
  return (angle + 360) % 360;
}

const ROUTE_NAMES = Object.keys(ROUTE_WAYPOINTS);

export function generateInitialFleet(count = 12): Vehicle[] {
  return Array.from({ length: count }, (_, i) => {
    const routeName = ROUTE_NAMES[i % ROUTE_NAMES.length];
    const waypoints = ROUTE_WAYPOINTS[routeName];
    const t = Math.random();
    const location = interpolatePosition(waypoints, t);
    const nextT = Math.min(t + 0.01, 1);
    const nextLoc = interpolatePosition(waypoints, nextT);
    const status = weightedRandom(STATUS_WEIGHTS);

    return {
      id: `VH-${String(i + 1).padStart(3, '0')}`,
      name: `Truck ${i + 1}`,
      plate: `DE-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 3) % 26))}-${1000 + i * 97}`,
      driver: DRIVERS[i % DRIVERS.length],
      status,
      location,
      speed: status === 'active' ? Math.round(randomBetween(60, 110)) : 0,
      heading: computeHeading(location, nextLoc),
      fuel: Math.round(randomBetween(15, 95)),
      engineTemp: Math.round(randomBetween(75, 100)),
      odometer: Math.round(randomBetween(50000, 350000)),
      lastSeen: new Date(),
      route: routeName,
      cargo: CARGO_TYPES[i % CARGO_TYPES.length],
    };
  });
}

let alertCounter = 0;

function generateAlert(vehicle: Vehicle): Alert | null {
  const alertTemplates: {
    type: AlertType;
    severity: AlertSeverity;
    condition: (v: Vehicle) => boolean;
    message: (v: Vehicle) => string;
  }[] = [
    {
      type: 'speeding',
      severity: 'warning',
      condition: (v) => v.speed > 100,
      message: (v) => `${v.name} is exceeding speed limit at ${v.speed} km/h`,
    },
    {
      type: 'low_fuel',
      severity: 'warning',
      condition: (v) => v.fuel < 20,
      message: (v) => `${v.name} fuel level critical: ${v.fuel}%`,
    },
    {
      type: 'engine_fault',
      severity: 'critical',
      condition: (v) => v.engineTemp > 98,
      message: (v) => `${v.name} engine overheating: ${v.engineTemp}°C`,
    },
    {
      type: 'harsh_braking',
      severity: 'warning',
      condition: () => Math.random() < 0.003,
      message: (v) => `Harsh braking event detected on ${v.name}`,
    },
    {
      type: 'route_deviation',
      severity: 'info',
      condition: () => Math.random() < 0.002,
      message: (v) => `${v.name} has deviated from planned route`,
    },
    {
      type: 'geofence_breach',
      severity: 'warning',
      condition: () => Math.random() < 0.002,
      message: (v) => `${v.name} has left designated zone`,
    },
    {
      type: 'driver_fatigue',
      severity: 'critical',
      condition: () => Math.random() < 0.001,
      message: (v) => `Driver fatigue alert for ${v.driver} on ${v.name}`,
    },
    {
      type: 'accident',
      severity: 'critical',
      condition: () => Math.random() < 0.0005,
      message: (v) => `Collision detected! ${v.name} may need emergency assistance`,
    },
  ];

  for (const tmpl of alertTemplates) {
    if (tmpl.condition(vehicle)) {
      alertCounter += 1;
      return {
        id: `ALT-${String(alertCounter).padStart(4, '0')}`,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        type: tmpl.type,
        severity: tmpl.severity,
        message: tmpl.message(vehicle),
        location: vehicle.location,
        timestamp: new Date(),
        acknowledged: false,
      };
    }
  }
  return null;
}

export function updateVehicle(vehicle: Vehicle): Vehicle {
  if (vehicle.status === 'offline' || vehicle.status === 'maintenance') {
    return { ...vehicle, lastSeen: vehicle.lastSeen };
  }

  const routeName = vehicle.route ?? ROUTE_NAMES[0];
  const waypoints = ROUTE_WAYPOINTS[routeName] ?? ROUTE_WAYPOINTS['Berlin-Munich'];

  // Advance position along route
  const stepSize = 0.0008 + Math.random() * 0.0004;
  const prevLat = vehicle.location.lat;
  const prevLng = vehicle.location.lng;

  // Find rough t from current position
  const totalLat = waypoints[waypoints.length - 1].lat - waypoints[0].lat;
  const totalLng = waypoints[waypoints.length - 1].lng - waypoints[0].lng;
  let t = 0;
  if (Math.abs(totalLat) > Math.abs(totalLng)) {
    t = (prevLat - waypoints[0].lat) / (totalLat || 1);
  } else {
    t = (prevLng - waypoints[0].lng) / (totalLng || 1);
  }
  t = Math.max(0, Math.min(1, t));
  let newT = t + stepSize;
  if (newT > 1) newT = 0; // Loop route

  const newLocation = interpolatePosition(waypoints, newT);
  const nextLocation = interpolatePosition(waypoints, Math.min(newT + 0.01, 1));

  const speedDelta = (Math.random() - 0.5) * 10;
  const newSpeed = Math.max(0, Math.min(130, vehicle.speed + speedDelta));
  const newFuel = Math.max(0, vehicle.fuel - 0.03 * (vehicle.status === 'active' ? 1 : 0));
  const engineDelta = (Math.random() - 0.5) * 2;
  const newEngineTemp = Math.max(70, Math.min(105, vehicle.engineTemp + engineDelta));

  return {
    ...vehicle,
    location: newLocation,
    heading: computeHeading(newLocation, nextLocation),
    speed: vehicle.status === 'active' ? Math.round(newSpeed) : 0,
    fuel: Math.round(newFuel * 10) / 10,
    engineTemp: Math.round(newEngineTemp * 10) / 10,
    lastSeen: new Date(),
  };
}

export function generateAlertsForFleet(vehicles: Vehicle[]): Alert[] {
  const alerts: Alert[] = [];
  for (const v of vehicles) {
    if (v.status === 'offline') continue;
    const alert = generateAlert(v);
    if (alert) alerts.push(alert);
  }
  return alerts;
}
