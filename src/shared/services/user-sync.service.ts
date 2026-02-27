import { prisma } from "../../database/prisma.client";
import { createClerkClient } from "@clerk/express";
import { CLERK_SECRET_KEY } from "../../config/env.config";

const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });

export class UserSyncService {
  /**
   * Get or create user in our database from Clerk ID
   * Returns our internal user ID and role
   */
  async getOrCreateUser(clerkId: string): Promise<{
    userId: string;
    role: string;
  }> {
    // Check if user exists in our database
    let user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, role: true },
    });

    if (user) {
      return {
        userId: user.id,
        role: user.role,
      };
    }

    // User doesn't exist, create it
    // Get user data from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkId);

    // Create user in our database
    const newUser = await prisma.user.create({
      data: {
        clerkId: clerkId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: clerkUser.firstName || null,
        lastName: clerkUser.lastName || null,
        imageUrl: clerkUser.imageUrl || null,
        role: "USER", // Default role
      },
      select: { id: true, role: true },
    });

    return {
      userId: newUser.id,
      role: newUser.role,
    };
  }

  /**
   * Update user data from Clerk
   */
  async updateUserFromClerk(clerkId: string): Promise<void> {
    const clerkUser = await clerkClient.users.getUser(clerkId);

    await prisma.user.update({
      where: { clerkId },
      data: {
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: clerkUser.firstName || null,
        lastName: clerkUser.lastName || null,
        imageUrl: clerkUser.imageUrl || null,
      },
    });
  }
}
