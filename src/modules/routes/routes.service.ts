import { prisma } from "../../database/prisma.client";
import { NotFoundError } from "../../shared/errors/custom-errors";

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
  async getRouteBySlug(
    slug: string,
    options?: {
      reviewsPage?: number;
      reviewsLimit?: number;
      photosLimit?: number;
    },
  ) {
    // Pagination for reviews
    const reviewsPage = options?.reviewsPage || 1;
    const reviewsLimit = Math.min(options?.reviewsLimit || 20, 100);
    const reviewsSkip = (reviewsPage - 1) * reviewsLimit;

    // Limit for photos (no pagination, just limit)
    const photosLimit = Math.min(options?.photosLimit || 20, 100);

    const route = await prisma.route.findUnique({
      where: { slug },
      include: {
        reviews: {
          skip: reviewsSkip,
          take: reviewsLimit,
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
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: photosLimit,
        },
        _count: {
          select: {
            favorites: true,
            routeCalls: true,
            reviews: true, // Total count for pagination
            photos: true, // Total count for reference
          },
        },
      },
    });

    if (!route) {
      throw new NotFoundError("Route not found");
    }

    // Calculate pagination metadata for reviews
    const totalReviews = route._count.reviews;
    const reviewsPagination = {
      page: reviewsPage,
      limit: reviewsLimit,
      totalCount: totalReviews,
      totalPages: Math.ceil(totalReviews / reviewsLimit),
      hasNextPage: reviewsPage < Math.ceil(totalReviews / reviewsLimit),
      hasPreviousPage: reviewsPage > 1,
    };

    return {
      ...route,
      reviewsPagination,
    };
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
