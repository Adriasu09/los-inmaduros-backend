import { Request, Response, NextFunction } from "express";
import { FavoritesService } from "./favorites.service";

export class FavoritesController {
  private favoritesService: FavoritesService;

  constructor() {
    this.favoritesService = new FavoritesService();
  }

  /**
   * POST /api/routes/:routeId/favorites
   * Add a route to favorites
   */
  addFavorite = async (
    req: Request<{ routeId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { routeId } = req.params;

      const userId = req.auth!.userId;

      const favorite = await this.favoritesService.addFavorite(userId, routeId);

      res.status(201).json({
        success: true,
        data: favorite,
        message: "Route added to favorites successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/routes/:routeId/favorites
   * Remove a route from favorites
   */
  removeFavorite = async (
    req: Request<{ routeId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { routeId } = req.params;

      const userId = req.auth!.userId;

      await this.favoritesService.removeFavorite(userId, routeId);

      res.status(200).json({
        success: true,
        message: "Route removed from favorites successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/favorites
   * Get all favorites for the authenticated user
   */
  getUserFavorites = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.auth!.userId;

      const favorites = await this.favoritesService.getUserFavorites(userId);

      res.status(200).json({
        success: true,
        data: favorites,
        count: favorites.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/favorites/check/:routeId
   * Check if a route is in favorites
   */
  checkIsFavorite = async (
    req: Request<{ routeId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { routeId } = req.params;

      const userId = req.auth!.userId;

      const isFavorite = await this.favoritesService.checkIsFavorite(
        userId,
        routeId,
      );

      res.status(200).json({
        success: true,
        data: {
          isFavorite,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
