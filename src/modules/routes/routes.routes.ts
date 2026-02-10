import { Router } from "express";
import { RoutesController } from "./routes.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import { getRouteBySlugSchema } from "./routes.validation";
import { registry } from "../../config/openapi-registry";
import { z } from "zod";

// Import schemas to register them in OpenAPI registry
import {
  routeBasicResponseSchema,
  routeDetailedResponseSchema,
} from "./routes.validation";

const router = Router();
const routesController = new RoutesController();

/**
 * Register OpenAPI paths
 */

// GET /api/routes
registry.registerPath({
  method: "get",
  path: "/api/routes",
  tags: ["Routes"],
  summary: "Get all routes",
  description:
    "Get all predefined routes with basic information, counts, and average rating. Public endpoint.",
  responses: {
    200: {
      description: "Routes retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/RouteBasicResponse",
                },
              },
              count: {
                type: "integer",
                example: 17,
                description: "Total number of routes",
              },
            },
          },
        },
      },
    },
  },
});

// GET /api/routes/:slug
registry.registerPath({
  method: "get",
  path: "/api/routes/{slug}",
  tags: ["Routes"],
  summary: "Get route by slug",
  description:
    "Get detailed information about a specific route including reviews, photos, and average rating. Public endpoint.",
  request: {
    params: z.object({
      slug: z.string().openapi({
        description: "Route slug (e.g., 'casa-de-campo')",
        example: "casa-de-campo",
      }),
    }),
  },
  responses: {
    200: {
      description: "Route retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/RouteDetailedResponse",
              },
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
  },
});

/**
 * Express routes
 */

// GET /api/routes
router.get("/", routesController.getAllRoutes);

// GET /api/routes/:slug
router.get(
  "/:slug",
  validate(getRouteBySlugSchema),
  routesController.getRouteBySlug,
);

export default router;
