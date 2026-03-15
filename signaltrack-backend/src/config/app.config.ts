import { registerAs } from '@nestjs/config';
import {
  DEFAULT_PORT,
  DEFAULT_CORS_ORIGIN,
  DEFAULT_ALERT_SPEED_THRESHOLD,
  DEFAULT_ALERT_FUEL_THRESHOLD,
} from './config.constants';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? String(DEFAULT_PORT), 10),
  corsOrigin: process.env.CORS_ORIGIN ?? DEFAULT_CORS_ORIGIN,
  alertSpeedThreshold: parseInt(
    process.env.ALERT_SPEED_THRESHOLD ?? String(DEFAULT_ALERT_SPEED_THRESHOLD),
    10,
  ),
  alertFuelThreshold: parseInt(
    process.env.ALERT_FUEL_THRESHOLD ?? String(DEFAULT_ALERT_FUEL_THRESHOLD),
    10,
  ),
}));

export type AppConfig = ReturnType<typeof appConfig>;
