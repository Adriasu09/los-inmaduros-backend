import { Request, Response, NextFunction } from "express";
import { RoutesService } from "./routes.service";

export class RoutesController {
  private routesService: RoutesService;

  constructor() {
    this.routesService = new RoutesService();
  }

  /**
   * GET /api/routes
   * Get all routes
   */
  getAllRoutes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const routes = await this.routesService.getAllRoutes();

      // Calculate average rating for each route
      const routesWithRating = await Promise.all(
        routes.map(async (route) => {
          const averageRating = await this.routesService.getRouteAverageRating(
            route.id,
          );
          return {
            ...route,
            averageRating: Number(averageRating.toFixed(1)),
          };
        }),
      );

      res.status(200).json({
        success: true,
        data: routesWithRating,
        count: routesWithRating.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/routes/:slug
   * Get a route by slug
   */
  getRouteBySlug = async (
    req: Request<{ slug: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { slug } = req.params;
      const { reviewsPage, reviewsLimit, photosLimit } = req.query as {
        reviewsPage?: number;
        reviewsLimit?: number;
        photosLimit?: number;
      };

      const route = await this.routesService.getRouteBySlug(slug, {
        reviewsPage,
        reviewsLimit,
        photosLimit,
      });

      const averageRating = await this.routesService.getRouteAverageRating(
        route.id,
      );

      res.status(200).json({
        success: true,
        data: {
          ...route,
          averageRating: Number(averageRating.toFixed(1)),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
