import { Module } from '@nestjs/common';
import { FleetGateway } from './fleet.gateway';
import { SimulationService } from './simulation.service';

@Module({
  providers: [FleetGateway, SimulationService],
})
export class FleetModule {}
