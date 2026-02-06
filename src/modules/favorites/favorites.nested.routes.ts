import { Router } from "express";
import { FavoritesController } from "./favorites.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import {
  addFavoriteSchema,
  removeFavoriteSchema,
} from "./favorites.validation";

const router = Router({ mergeParams: true });
const favoritesController = new FavoritesController();

/**
 * Nested routes under /api/routes/:routeId/favorites
 */

/**
 * @route   POST /api/routes/:routeId/favorites
 * @desc    Add a route to favorites
 * @access  Private (requires authentication)
 */
router.post("/", validate(addFavoriteSchema), favoritesController.addFavorite);

/**
 * @route   DELETE /api/routes/:routeId/favorites
 * @desc    Remove a route from favorites
 * @access  Private (requires authentication)
 */
router.delete(
  "/",
  validate(removeFavoriteSchema),
  favoritesController.removeFavorite,
);

export default router;
