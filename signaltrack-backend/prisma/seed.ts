import 'dotenv/config';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(
  process.env.DATABASE_URL! + '&allowPublicKeyRetrieval=true',
);
const prisma = new PrismaClient({ adapter });

const vehicles = [
  {
    plateNumber: 'B-101-ABC',
    driverName: 'Ion Popescu',
    status: 'moving' as const,
    speed: 65,
    fuelLevel: 72,
    lat: 44.4268,
    lng: 26.1025,
  },
  {
    plateNumber: 'B-202-DEF',
    driverName: 'Maria Ionescu',
    status: 'idle' as const,
    speed: 0,
    fuelLevel: 45,
    lat: 44.4361,
    lng: 26.0969,
  },
  {
    plateNumber: 'B-303-GHI',
    driverName: 'Andrei Vasile',
    status: 'moving' as const,
    speed: 88,
    fuelLevel: 31,
    lat: 44.4478,
    lng: 26.0979,
  },
  {
    plateNumber: 'B-404-JKL',
    driverName: 'Elena Dumitrescu',
    status: 'alert' as const,
    speed: 135,
    fuelLevel: 12,
    lat: 44.4155,
    lng: 26.1063,
  },
  {
    plateNumber: 'B-505-MNO',
    driverName: 'Alexandru Mihai',
    status: 'offline' as const,
    speed: 0,
    fuelLevel: 89,
    lat: 44.4328,
    lng: 26.1125,
  },
  {
    plateNumber: 'CJ-10-RAU',
    driverName: 'Cristian Moldovan',
    status: 'moving' as const,
    speed: 52,
    fuelLevel: 60,
    lat: 46.7712,
    lng: 23.6236,
  },
  {
    plateNumber: 'TM-77-XYZ',
    driverName: 'Laura Petrescu',
    status: 'idle' as const,
    speed: 0,
    fuelLevel: 95,
    lat: 45.7489,
    lng: 21.2087,
  },
  {
    plateNumber: 'IS-22-QRS',
    driverName: 'Bogdan Georgescu',
    status: 'moving' as const,
    speed: 110,
    fuelLevel: 8,
    lat: 47.1585,
    lng: 27.6014,
  },
];

async function main() {
  console.log('Seeding database...');

  for (const vehicle of vehicles) {
    const created = await prisma.vehicle.upsert({
      where: { plateNumber: vehicle.plateNumber },
      update: vehicle,
      create: vehicle,
    });
    console.log(`  Vehicle: ${created.plateNumber} (${created.driverName})`);
  }

  const alertVehicles = await prisma.vehicle.findMany({
    where: {
      OR: [{ speed: { gt: 120 } }, { fuelLevel: { lt: 15 } }],
    },
  });

  for (const v of alertVehicles) {
    if (v.speed > 120) {
      await prisma.alert.create({
        data: {
          vehicleId: v.id,
          type: 'speed',
          value: v.speed,
          threshold: 120,
        },
      });
      console.log(`  Alert: speed for ${v.plateNumber} (${v.speed} km/h)`);
    }
    if (v.fuelLevel < 15) {
      await prisma.alert.create({
        data: {
          vehicleId: v.id,
          type: 'fuel',
          value: v.fuelLevel,
          threshold: 15,
        },
      });
      console.log(`  Alert: fuel for ${v.plateNumber} (${v.fuelLevel}%)`);
    }
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
