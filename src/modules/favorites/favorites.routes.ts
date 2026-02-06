import { Router } from "express";
import { FavoritesController } from "./favorites.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import {
  checkFavoriteSchema,
} from "./favorites.validation";

const router = Router();
const favoritesController = new FavoritesController();

/**
 * @route   GET /api/favorites
 * @desc    Get all favorites for the authenticated user
 * @access  Private (requires authentication)
 */
router.get("/", favoritesController.getUserFavorites);

/**
 * @route   GET /api/favorites/check/:routeId
 * @desc    Check if a route is in user's favorites
 * @access  Private (requires authentication)
 */
router.get(
  "/check/:routeId",
  validate(checkFavoriteSchema),
  favoritesController.checkIsFavorite,
);

export default router;
