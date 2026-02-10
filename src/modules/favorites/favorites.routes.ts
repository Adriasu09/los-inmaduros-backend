import { Router } from "express";
import { FavoritesController } from "./favorites.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import { checkFavoriteSchema } from "./favorites.validation";
import { requireAuth } from "../../shared/middlewares/auth.middleware";
import { registry } from "../../config/openapi-registry";
import { z } from "zod";

// Import schemas to register them in OpenAPI registry
import {
  favoriteResponseSchema,
  checkFavoriteResponseSchema,
} from "./favorites.validation";

const router = Router();
const favoritesController = new FavoritesController();

/**
 * Register OpenAPI paths
 */

// GET /api/favorites
registry.registerPath({
  method: "get",
  path: "/api/favorites",
  tags: ["Favorites"],
  summary: "Get my favorites",
  description:
    "Get all favorite routes for the authenticated user with route details",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Favorites retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/FavoriteResponse",
                },
              },
              count: {
                type: "integer",
                example: 5,
                description: "Total number of favorites",
              },
            },
          },
        },
      },
    },
    401: {
      description: "Unauthorized - Invalid or missing token",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Unauthorized" },
            },
          },
        },
      },
    },
  },
});

// GET /api/favorites/check/:routeId
registry.registerPath({
  method: "get",
  path: "/api/favorites/check/{routeId}",
  tags: ["Favorites"],
  summary: "Check if route is favorite",
  description: "Check if a specific route is in the user's favorites",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      routeId: z.string().uuid().openapi({
        description: "ID of the route to check",
        example: "987e6543-e21b-12d3-a456-426614174000",
      }),
    }),
  },
  responses: {
    200: {
      description: "Check completed successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/CheckFavoriteResponse",
              },
            },
          },
        },
      },
    },
    401: {
      description: "Unauthorized - Invalid or missing token",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Unauthorized" },
            },
          },
        },
      },
    },
  },
});

/**
 * Express routes
 */

// GET /api/favorites
router.get("/", requireAuth, favoritesController.getUserFavorites);

// GET /api/favorites/check/:routeId
router.get(
  "/check/:routeId",
  requireAuth,
  validate(checkFavoriteSchema),
  favoritesController.checkIsFavorite,
);

export default router;
