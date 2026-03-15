import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { AlertsModule } from './alerts/alerts.module';
import { FleetModule } from './fleet/fleet.module';

@Module({
  imports: [
    AppConfigModule,
    CommonModule,
    PrismaModule,
    VehiclesModule,
    AlertsModule,
    FleetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
