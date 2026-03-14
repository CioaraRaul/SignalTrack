import * as L from 'leaflet';
import { VehicleStatus } from '../../state/models/vehicle.model';
import { STATUS_COLORS } from '../../state/fleet.constants';

export function createMarkerIcon(status: VehicleStatus): L.DivIcon {
  const color = STATUS_COLORS[status];

  return L.divIcon({
    className: 'vehicle-marker',
    html: `
      <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="12" fill="${color}" stroke="white" stroke-width="2.5"/>
        <circle cx="14" cy="14" r="5" fill="white" opacity="0.9"/>
      </svg>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}
