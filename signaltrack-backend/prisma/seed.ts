import 'dotenv/config';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(
  process.env.DATABASE_URL! + '&allowPublicKeyRetrieval=true',
);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Database ready — no seed data. Create vehicles manually.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
