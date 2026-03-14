import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full',
  },
  {
    path: 'map',
    loadChildren: () => import('./features/map/map.routes').then((m) => m.MAP_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'alerts',
    loadChildren: () => import('./features/alerts/alerts.routes').then((m) => m.ALERTS_ROUTES),
  },
  {
    path: 'vehicles',
    loadChildren: () =>
      import('./features/vehicles/vehicles.routes').then((m) => m.VEHICLES_ROUTES),
  },
];
