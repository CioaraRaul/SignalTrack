import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { FleetModule } from './fleet/fleet.module';

@Module({
  imports: [VehiclesModule, FleetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
