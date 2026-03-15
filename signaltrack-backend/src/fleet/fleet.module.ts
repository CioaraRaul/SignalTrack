import { Module } from '@nestjs/common';
import { FleetGateway } from './fleet.gateway';
import { FleetService } from './fleet.service';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [AlertsModule],
  providers: [FleetGateway, FleetService],
})
export class FleetModule {}
