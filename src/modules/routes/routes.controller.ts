import { Request, Response } from "express";
import { RoutesService } from "./routes.service";
import { routeSlugSchema } from "./routes.validation";
import { ZodError } from "zod";

export class RoutesController {
  private routesService: RoutesService;

  constructor() {
    this.routesService = new RoutesService();
  }

  /**
   * GET /api/routes
   * Obtener todas las rutas
   */
  getAllRoutes = async (req: Request, res: Response) => {
    try {
      const routes = await this.routesService.getAllRoutes();

      // Calcular rating promedio para cada ruta
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
      console.error("Error al obtener rutas:", error);
      res.status(500).json({
        success: false,
        error: "Error al obtener las rutas",
      });
    }
  };

  /**
   * GET /api/routes/:slug
   * Obtener una ruta por slug
   */
  getRouteBySlug = async (req: Request, res: Response) => {
    try {
      // Validar parámetros
      const { slug } = routeSlugSchema.parse(req.params);

      const route = await this.routesService.getRouteBySlug(slug);
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
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Parámetros inválidos",
          details: error.issues,
        });
      }

      if (error instanceof Error && error.message === "Ruta no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      console.error("Error al obtener ruta:", error);
      res.status(500).json({
        success: false,
        error: "Error al obtener la ruta",
      });
    }
  };
}
