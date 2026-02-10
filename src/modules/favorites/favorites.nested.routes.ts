import { Router } from "express";
import { FavoritesController } from "./favorites.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import {
  addFavoriteSchema,
  removeFavoriteSchema,
} from "./favorites.validation";
import { requireAuth } from "../../shared/middlewares/auth.middleware";
import { registry } from "../../config/openapi-registry";
import { z } from "zod";

const router = Router({ mergeParams: true });
const favoritesController = new FavoritesController();

/**
 * Register OpenAPI paths for nested routes
 */

// POST /api/routes/:routeId/favorites
registry.registerPath({
  method: "post",
  path: "/api/routes/{routeId}/favorites",
  tags: ["Favorites"],
  summary: "Add route to favorites",
  description:
    "Add a route to user's favorites. Cannot add the same route twice.",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      routeId: z.string().uuid().openapi({
        description: "ID of the route to add to favorites",
        example: "987e6543-e21b-12d3-a456-426614174000",
      }),
    }),
  },
  responses: {
    201: {
      description: "Route added to favorites successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/FavoriteResponse",
              },
              message: {
                type: "string",
                example: "Route added to favorites successfully",
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
    404: {
      description: "Route not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Route not found" },
            },
          },
        },
      },
    },
    409: {
      description: "Conflict - Route already in favorites",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "Route is already in your favorites",
              },
            },
          },
        },
      },
    },
  },
});

// DELETE /api/routes/:routeId/favorites
registry.registerPath({
  method: "delete",
  path: "/api/routes/{routeId}/favorites",
  tags: ["Favorites"],
  summary: "Remove route from favorites",
  description: "Remove a route from user's favorites",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      routeId: z.string().uuid().openapi({
        description: "ID of the route to remove from favorites",
        example: "987e6543-e21b-12d3-a456-426614174000",
      }),
    }),
  },
  responses: {
    200: {
      description: "Route removed from favorites successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: {
                type: "string",
                example: "Route removed from favorites successfully",
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
    404: {
      description: "Favorite not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Favorite not found" },
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

// POST /api/routes/:routeId/favorites
router.post(
  "/",
  requireAuth,
  validate(addFavoriteSchema),
  favoritesController.addFavorite,
);

// DELETE /api/routes/:routeId/favorites
router.delete(
  "/",
  requireAuth,
  validate(removeFavoriteSchema),
  favoritesController.removeFavorite,
);

export default router;
