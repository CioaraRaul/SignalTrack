import { useState, useEffect, useCallback } from 'react';
import {
  Truck,
  AlertTriangle,
  Activity,
  Fuel,
  Bell,
  Map as MapIcon,
} from 'lucide-react';

import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import StatsCard from './components/Dashboard/StatsCard';
import FleetMap from './components/Dashboard/FleetMap';
import VehicleList from './components/Dashboard/VehicleList';
import AlertsPanel from './components/Alerts/AlertsPanel';
import PerformanceChart from './components/Dashboard/PerformanceChart';
import VehicleDetail from './components/Vehicles/VehicleDetail';

import { vehicles as initialVehicles, alerts as initialAlerts, performanceData, computeFleetStats } from './data/mockData';
import type { Vehicle, Alert, ActiveView } from './types/fleet';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Simulate real-time vehicle position + speed updates every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.status !== 'active') return v;
          const speedDelta = (Math.random() - 0.5) * 6;
          const newSpeed = Math.max(20, Math.min(80, v.speed + speedDelta));
          const latDelta = (Math.random() - 0.48) * 0.003;
          const lngDelta = (Math.random() - 0.48) * 0.003;
          return {
            ...v,
            speed: Math.round(newSpeed),
            lat: v.lat + latDelta,
            lng: v.lng + lngDelta,
            lastUpdated: new Date(),
          };
        })
      );
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const stats = computeFleetStats(vehicles, alerts);

  const handleAcknowledge = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  }, []);

  const handleVehicleSelect = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle((prev) => (prev?.id === vehicle.id ? null : vehicle));
    setActiveView('dashboard');
  }, []);

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);

  const contentClass = `transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header
        unacknowledgedAlerts={unacknowledgedAlerts}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        onAlertClick={() => setActiveView('alerts')}
        currentTime={currentTime}
      />

      <Sidebar
        open={sidebarOpen}
        activeView={activeView}
        onNavigate={setActiveView}
        stats={stats}
      />

      <main className={`pt-14 min-h-screen ${contentClass}`}>
        {/* ── DASHBOARD ── */}
        {activeView === 'dashboard' && (
          <div className="p-4 space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <StatsCard
                title="Total Fleet"
                value={stats.totalVehicles}
                subtitle={`${stats.activeVehicles} active now`}
                icon={Truck}
                color="blue"
                pulse
              />
              <StatsCard
                title="Active"
                value={stats.activeVehicles}
                subtitle="Vehicles en route"
                icon={Activity}
                color="green"
              />
              <StatsCard
                title="Active Alerts"
                value={stats.activeAlerts}
                subtitle={`${stats.criticalAlerts} critical`}
                icon={AlertTriangle}
                color={stats.criticalAlerts > 0 ? 'red' : 'amber'}
              />
              <StatsCard
                title="Avg Fuel"
                value={`${stats.averageFuelLevel}%`}
                subtitle="Fleet average"
                icon={Fuel}
                color={stats.averageFuelLevel < 40 ? 'amber' : 'cyan'}
              />
              <StatsCard
                title="Distance Today"
                value={stats.totalDistanceToday.toLocaleString()}
                subtitle="Total miles"
                icon={MapIcon}
                color="purple"
              />
              <StatsCard
                title="Offline"
                value={stats.offlineVehicles}
                subtitle={`${stats.maintenanceVehicles} in maintenance`}
                icon={Bell}
                color="amber"
              />
            </div>

            {/* Map + Alerts + Detail */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Map — takes 2/3 */}
              <div className="xl:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <MapIcon size={15} className="text-blue-400" />
                    Live Fleet Map
                  </h2>
                  <span className="text-xs text-slate-500">
                    {vehicles.length} vehicles tracked
                  </span>
                </div>
                <div className="h-80">
                  <FleetMap
                    vehicles={vehicles}
                    alerts={alerts}
                    onVehicleSelect={handleVehicleSelect}
                    selectedVehicle={selectedVehicle}
                  />
                </div>
              </div>

              {/* Alerts panel — 1/3 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Bell size={15} className="text-amber-400" />
                    Active Alerts
                  </h2>
                  <span className="text-xs text-slate-500">
                    {unacknowledgedAlerts.length} unacknowledged
                  </span>
                </div>
                <div className="h-80 overflow-y-auto">
                  <AlertsPanel
                    alerts={alerts}
                    onAcknowledge={handleAcknowledge}
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Detail + Performance */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {selectedVehicle ? (
                <div className="xl:col-span-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck size={15} className="text-blue-400" />
                    <h2 className="text-sm font-semibold text-slate-300">
                      Vehicle Detail
                    </h2>
                  </div>
                  <VehicleDetail
                    vehicle={selectedVehicle}
                    onClose={() => setSelectedVehicle(null)}
                  />
                </div>
              ) : null}

              {/* Performance Chart */}
              <div className={selectedVehicle ? 'xl:col-span-2' : 'xl:col-span-3'}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={15} className="text-green-400" />
                  <h2 className="text-sm font-semibold text-slate-300">
                    Fleet Performance — Today
                  </h2>
                </div>
                <div className="h-48 bg-slate-900 rounded-xl border border-slate-700 p-4">
                  <PerformanceChart data={performanceData} />
                </div>
              </div>
            </div>

            {/* Vehicle Table */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Truck size={15} className="text-blue-400" />
                <h2 className="text-sm font-semibold text-slate-300">
                  Vehicle Fleet
                </h2>
              </div>
              <div className="h-72">
                <VehicleList
                  vehicles={vehicles}
                  onSelect={handleVehicleSelect}
                  selectedVehicle={selectedVehicle}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── VEHICLES ── */}
        {activeView === 'vehicles' && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Truck size={18} className="text-blue-400" />
              <h1 className="text-lg font-bold text-white">Vehicle Fleet</h1>
              <span className="ml-auto text-sm text-slate-500">
                {vehicles.length} vehicles registered
              </span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2 h-[calc(100vh-12rem)]">
                <VehicleList
                  vehicles={vehicles}
                  onSelect={handleVehicleSelect}
                  selectedVehicle={selectedVehicle}
                />
              </div>
              <div className="h-[calc(100vh-12rem)]">
                {selectedVehicle ? (
                  <VehicleDetail
                    vehicle={selectedVehicle}
                    onClose={() => setSelectedVehicle(null)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full rounded-xl border border-slate-700 bg-slate-900 text-slate-500">
                    <Truck size={36} className="mb-3 opacity-30" />
                    <p className="text-sm">Select a vehicle to see details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ALERTS ── */}
        {activeView === 'alerts' && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-amber-400" />
              <h1 className="text-lg font-bold text-white">Alert Management</h1>
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/20">
                {unacknowledgedAlerts.length} unacknowledged
              </span>
            </div>
            <div className="max-w-2xl">
              <AlertsPanel
                alerts={alerts}
                onAcknowledge={handleAcknowledge}
                showAll
              />
            </div>
          </div>
        )}

        {/* ── ROUTES ── */}
        {activeView === 'routes' && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <MapIcon size={18} className="text-blue-400" />
              <h1 className="text-lg font-bold text-white">Route Tracker</h1>
            </div>
            <div className="h-[calc(100vh-10rem)]">
              <FleetMap
                vehicles={vehicles}
                alerts={alerts}
                onVehicleSelect={handleVehicleSelect}
                selectedVehicle={selectedVehicle}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
