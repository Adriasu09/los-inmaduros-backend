import { prisma } from "../../database/prisma.client";
import {
  NotFoundError,
  ConflictError,
} from "../../shared/errors/custom-errors";

export class FavoritesService {
  /**
   * Add a route to user's favorites
   */
  async addFavorite(userId: string, routeId: string) {
    // Verify route exists
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new NotFoundError("Route not found");
    }

    // Check if already in favorites
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        routeId_userId: {
          routeId,
          userId,
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictError("Route is already in your favorites");
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        routeId,
      },
      include: {
        route: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            approximateDistance: true,
            level: true,
          },
        },
      },
    });

    return favorite;
  }

  /**
   * Remove a route from user's favorites
   */
  async removeFavorite(userId: string, routeId: string) {
    // Check if favorite exists
    const favorite = await prisma.favorite.findUnique({
      where: {
        routeId_userId: {
          routeId,
          userId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundError("Favorite not found");
    }

    // Remove from favorites
    await prisma.favorite.delete({
      where: {
        routeId_userId: {
          routeId,
          userId,
        },
      },
    });
  }

  /**
   * Get all favorites for a user
   */
  async getUserFavorites(userId: string) {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        route: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            approximateDistance: true,
            description: true,
            level: true,
            createdAt: true,
            _count: {
              select: {
                reviews: true,
                routeCalls: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return favorites;
  }

  /**
   * Check if a route is in user's favorites
   */
  async checkIsFavorite(userId: string, routeId: string): Promise<boolean> {
    const favorite = await prisma.favorite.findUnique({
      where: {
        routeId_userId: {
          routeId,
          userId,
        },
      },
    });

    return !!favorite; // Convert to boolean
  }
}
