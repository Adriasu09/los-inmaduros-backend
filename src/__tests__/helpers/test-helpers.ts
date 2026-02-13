/**
 * Generate a mock Clerk user ID
 */
export function generateMockUserId(prefix = "user"): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Generate a valid future date
 */
export function generateFutureDate(daysFromNow = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

/**
 * Generate a valid UUID
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create a test route in database
 */
export async function createTestRoute(prisma: any) {
  return await prisma.route.create({
    data: {
      name: "Test Route",
      slug: `test-route-${Date.now()}`,
      image: "https://example.com/test.jpg",
      approximateDistance: "10 km",
      description: "Test route description",
      level: ["BEGINNER"],
      gpxFileUrl: null,
      mapEmbedUrl: null,
    },
  });
}

/**
 * Create a test user in database
 */
export async function createTestUser(prisma: any, userId?: string) {
  const id = userId || generateMockUserId();

  return await prisma.user.create({
    data: {
      id,
      email: `test-${Date.now()}@example.com`,
      name: "Test User",
      imageUrl: "https://example.com/avatar.jpg",
      role: "USER",
    },
  });
}
