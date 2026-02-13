import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

/**
 * Get Prisma client for testing
 * Uses singleton pattern to reuse connection
 */
export function getTestPrisma(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  return prisma;
}

/**
 * Clean database between tests
 */
export async function cleanDatabase() {
  const prisma = getTestPrisma();

  // Delete in correct order (respect foreign keys)
  await prisma.photo.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.meetingPoint.deleteMany();
  await prisma.routeCall.deleteMany();
  await prisma.route.deleteMany();
  await prisma.user.deleteMany();
}

/**
 * Disconnect Prisma after all tests
 */
export async function disconnectTestPrisma() {
  const prisma = getTestPrisma();
  await prisma.$disconnect();
}
