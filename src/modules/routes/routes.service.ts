import { prisma } from "../../database/prisma.client";

export class RoutesService {
  /**
   * Obtener todas las rutas
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
   * Obtener una ruta por slug
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
      throw new Error("Ruta no encontrada");
    }

    return route;
  }

  /**
   * Calcular rating promedio de una ruta
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
