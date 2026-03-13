import { useState, useEffect, useCallback } from 'react';
import type { Vehicle, Alert, FleetStats } from '../types';
import {
  generateInitialFleet,
  updateVehicle,
  generateAlertsForFleet,
} from '../services/fleetSimulator';

const MAX_ALERTS = 200;
const UPDATE_INTERVAL_MS = 2000;

function computeStats(vehicles: Vehicle[], alerts: Alert[]): FleetStats {
  const active = vehicles.filter((v) => v.status === 'active').length;
  const idle = vehicles.filter((v) => v.status === 'idle').length;
  const maintenance = vehicles.filter((v) => v.status === 'maintenance').length;
  const offline = vehicles.filter((v) => v.status === 'offline').length;
  const alertVehicles = vehicles.filter((v) => v.status === 'alert').length;

  const unacked = alerts.filter((a) => !a.acknowledged);
  const critical = unacked.filter((a) => a.severity === 'critical').length;
  const warning = unacked.filter((a) => a.severity === 'warning').length;

  const activeVehicles = vehicles.filter(
    (v) => v.status === 'active' && v.speed > 0,
  );
  const avgSpeed =
    activeVehicles.length > 0
      ? Math.round(
          activeVehicles.reduce((s, v) => s + v.speed, 0) /
            activeVehicles.length,
        )
      : 0;

  return {
    totalVehicles: vehicles.length,
    activeVehicles: active,
    idleVehicles: idle,
    maintenanceVehicles: maintenance,
    offlineVehicles: offline,
    alertVehicles,
    criticalAlerts: critical,
    warningAlerts: warning,
    averageSpeed: avgSpeed,
    totalDistanceToday: Math.round(active * 187 + idle * 43),
  };
}

export interface FleetState {
  vehicles: Vehicle[];
  alerts: Alert[];
  stats: FleetStats;
  selectedVehicleId: string | null;
  selectVehicle: (id: string | null) => void;
  acknowledgeAlert: (id: string) => void;
  acknowledgeAllAlerts: () => void;
}

export function useFleet(): FleetState {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    generateInitialFleet(12),
  );
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setVehicles((prev) => {
        const updated = prev.map(updateVehicle);
        const newAlerts = generateAlertsForFleet(updated);
        if (newAlerts.length > 0) {
          setAlerts((prevAlerts) => {
            const combined = [...newAlerts, ...prevAlerts];
            return combined.slice(0, MAX_ALERTS);
          });
        }
        return updated;
      });
    }, UPDATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const selectVehicle = useCallback((id: string | null) => {
    setSelectedVehicleId(id);
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    );
  }, []);

  const acknowledgeAllAlerts = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  }, []);

  const stats = computeStats(vehicles, alerts);

  return {
    vehicles,
    alerts,
    stats,
    selectedVehicleId,
    selectVehicle,
    acknowledgeAlert,
    acknowledgeAllAlerts,
  };
}
