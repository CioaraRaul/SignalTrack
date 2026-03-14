import { Component, ElementRef, OnDestroy, OnInit, ViewChild, effect } from '@angular/core';
import { MapService } from './map.service';
import { fleetStore } from '../../state/fleet.store';
import { DEMO_VEHICLES } from '../../state/mock/demo-vehicles';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  constructor(private mapService: MapService) {
    effect(() => {
      const vehicles = fleetStore.vehicles();
      this.mapService.syncMarkers(vehicles);
    });
  }

  ngOnInit(): void {
    this.mapService.initMap(this.mapContainer.nativeElement);
    // Demo data — replace with API/WebSocket when backend is connected
    fleetStore.setVehicles(DEMO_VEHICLES);
  }

  ngOnDestroy(): void {
    this.mapService.destroyMap();
  }
}
