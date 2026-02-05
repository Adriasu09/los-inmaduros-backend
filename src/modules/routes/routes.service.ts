import { prisma } from "../../database/prisma.client";
import { NotFoundError } from "../../shared/custom-errors";

export class RoutesService {
  /**
   * Get all routes
   */
  async getAllRoutes() {
    return await prisma.route.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            reviews: true,
            favorites: true,
            routeCalls: true,
            photos: true,
          },
        },
      },
    });
  }

  /**
   * Get a route by slug
   */
  async getRouteBySlug(slug: string) {
    const route = await prisma.route.findUnique({
      where: { slug },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        photos: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        _count: {
          select: {
            favorites: true,
            routeCalls: true,
          },
        },
      },
    });

    if (!route) {
      throw new NotFoundError("Route not found");
    }

    return route;
  }

  /**
   * Calculate average rating for a route
   */
  async getRouteAverageRating(routeId: string): Promise<number> {
    const result = await prisma.review.aggregate({
      where: { routeId },
      _avg: {
        rating: true,
      },
    });

    return result._avg.rating || 0;
  }
}