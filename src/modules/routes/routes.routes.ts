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
    "Get detailed information about a specific route including reviews (paginated), photos (limited), and average rating. Public endpoint.",
  request: {
    params: z.object({
      slug: z.string().openapi({
        description: "Route slug (e.g., 'casa-de-campo')",
        example: "casa-de-campo",
      }),
    }),
    query: z.object({
      reviewsPage: z.string().optional().openapi({
        description: "Reviews page number (default: 1)",
        example: "1",
      }),
      reviewsLimit: z.string().optional().openapi({
        description: "Reviews per page (default: 20, max: 100)",
        example: "20",
      }),
      photosLimit: z.string().optional().openapi({
        description: "Number of photos to return (default: 20, max: 100)",
        example: "20",
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
                allOf: [
                  {
                    $ref: "#/components/schemas/RouteDetailedResponse",
                  },
                  {
                    type: "object",
                    properties: {
                      reviewsPagination: {
                        type: "object",
                        properties: {
                          page: {
                            type: "integer",
                            example: 1,
                            description: "Current page number for reviews",
                          },
                          limit: {
                            type: "integer",
                            example: 20,
                            description: "Reviews per page",
                          },
                          totalCount: {
                            type: "integer",
                            example: 45,
                            description:
                              "Total number of reviews for this route",
                          },
                          totalPages: {
                            type: "integer",
                            example: 3,
                            description: "Total number of pages",
                          },
                          hasNextPage: {
                            type: "boolean",
                            example: true,
                            description: "Whether there is a next page",
                          },
                          hasPreviousPage: {
                            type: "boolean",
                            example: false,
                            description: "Whether there is a previous page",
                          },
                        },
                      },
                    },
                  },
                ],
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
