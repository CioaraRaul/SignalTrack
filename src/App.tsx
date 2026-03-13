import { useState } from 'react';
import { useFleet } from './hooks/useFleet';
import { Header } from './components/Dashboard/Header';
import { FleetStatsGrid } from './components/Dashboard/FleetStatsGrid';
import { FleetMap } from './components/Map/FleetMap';
import { FleetList } from './components/Fleet/FleetList';
import { VehicleDetail } from './components/Fleet/VehicleDetail';
import { AlertsPanel } from './components/Alerts/AlertsPanel';
import { LayoutDashboard, Map, Bell } from 'lucide-react';

type ActiveTab = 'dashboard' | 'map' | 'alerts';

export default function App() {
  const fleet = useFleet();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const selectedVehicle = fleet.vehicles.find(
    (v) => v.id === fleet.selectedVehicleId,
  ) ?? null;

  const unackedCount = fleet.alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      <Header stats={fleet.stats} />

      {/* Mobile Tab Bar */}
      <div className="flex lg:hidden border-b border-slate-700/50 bg-slate-900/60 flex-shrink-0">
        {(
          [
            { id: 'dashboard' as const, icon: <LayoutDashboard size={16} />, label: 'Dashboard', badge: 0 },
            { id: 'map' as const, icon: <Map size={16} />, label: 'Map', badge: 0 },
            { id: 'alerts' as const, icon: <Bell size={16} />, label: 'Alerts', badge: unackedCount },
          ]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge > 0 && (
              <span className="absolute top-1 right-1/4 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {tab.badge > 9 ? '9+' : tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop layout */}
        <div className="hidden lg:flex h-full gap-0">
          {/* Left sidebar: Fleet list */}
          <aside className="w-72 xl:w-80 flex-shrink-0 flex flex-col border-r border-slate-700/50 bg-slate-900/40 overflow-hidden">
            <div className="p-4 flex-1 overflow-hidden flex flex-col min-h-0">
              <FleetList
                vehicles={fleet.vehicles}
                selectedVehicleId={fleet.selectedVehicleId}
                onVehicleSelect={fleet.selectVehicle}
              />
            </div>
          </aside>

          {/* Center: Map + Stats */}
          <main className="flex-1 flex flex-col gap-0 overflow-hidden min-w-0">
            {/* Stats grid */}
            <div className="p-4 flex-shrink-0 border-b border-slate-700/50">
              <FleetStatsGrid stats={fleet.stats} />
            </div>

            {/* Map */}
            <div className="flex-1 p-4 overflow-hidden">
              {selectedVehicle && (
                <div className="mb-3">
                  <VehicleDetail
                    vehicle={selectedVehicle}
                    onClose={() => fleet.selectVehicle(null)}
                  />
                </div>
              )}
              <div className={selectedVehicle ? 'h-[calc(100%-200px)]' : 'h-full'}>
                <FleetMap
                  vehicles={fleet.vehicles}
                  selectedVehicleId={fleet.selectedVehicleId}
                  onVehicleSelect={fleet.selectVehicle}
                />
              </div>
            </div>
          </main>

          {/* Right sidebar: Alerts */}
          <aside className="w-80 xl:w-96 flex-shrink-0 flex flex-col border-l border-slate-700/50 bg-slate-900/40 overflow-hidden">
            <div className="p-4 flex-1 overflow-hidden flex flex-col min-h-0">
              <AlertsPanel
                alerts={fleet.alerts}
                onAcknowledge={fleet.acknowledgeAlert}
                onAcknowledgeAll={fleet.acknowledgeAllAlerts}
              />
            </div>
          </aside>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden h-full overflow-hidden">
          {activeTab === 'dashboard' && (
            <div className="h-full overflow-y-auto p-4 space-y-4">
              <FleetStatsGrid stats={fleet.stats} />
              {selectedVehicle && (
                <VehicleDetail
                  vehicle={selectedVehicle}
                  onClose={() => fleet.selectVehicle(null)}
                />
              )}
              <FleetList
                vehicles={fleet.vehicles}
                selectedVehicleId={fleet.selectedVehicleId}
                onVehicleSelect={fleet.selectVehicle}
              />
            </div>
          )}
          {activeTab === 'map' && (
            <div className="h-full p-4">
              <FleetMap
                vehicles={fleet.vehicles}
                selectedVehicleId={fleet.selectedVehicleId}
                onVehicleSelect={(id) => {
                  fleet.selectVehicle(id);
                  setActiveTab('dashboard');
                }}
              />
            </div>
          )}
          {activeTab === 'alerts' && (
            <div className="h-full overflow-hidden p-4 flex flex-col">
              <AlertsPanel
                alerts={fleet.alerts}
                onAcknowledge={fleet.acknowledgeAlert}
                onAcknowledgeAll={fleet.acknowledgeAllAlerts}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
