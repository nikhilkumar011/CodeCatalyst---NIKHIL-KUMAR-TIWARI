// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'; // Use appropriate adapter (e.g., PrismaPg for PostgreSQL)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    // Add connection pool settings for production if needed
  }),
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;   