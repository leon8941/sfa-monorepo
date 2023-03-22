import { PrismaClient as BasePrismaClient } from '@prisma/client';

class PrismaClient extends BasePrismaClient {}

export const prisma = new PrismaClient();
