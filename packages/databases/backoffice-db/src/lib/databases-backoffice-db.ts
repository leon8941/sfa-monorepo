import { PrismaClient } from '@prisma/client';

const _ = new PrismaClient();

export function databasesBackofficeDb(): string {
  
  return 'databases-backoffice-db';
}
