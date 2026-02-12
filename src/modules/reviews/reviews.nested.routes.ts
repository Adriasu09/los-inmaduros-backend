import { Router } from "express";
import { ReviewsController } from "./reviews.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import {
  getRouteReviewsSchema,
  createReviewSchema,
} from "./reviews.validation";
import { requireAuth } from "../../shared/middlewares/auth.middleware";
import { registry } from "../../config/openapi-registry";
import { z } from "zod";

const router = Router({ mergeParams: true });
const reviewsController = new ReviewsController();

/**
 * Register OpenAPI paths for nested routes
 */

// GET /api/routes/:routeId/reviews
registry.registerPath({
  method: "get",
  path: "/api/routes/{routeId}/reviews",
  tags: ["Reviews"],
  summary: "Get route reviews",
  description:
    "Get all reviews for a specific route with pagination. Default: 20 items per page, max 100.",
  request: {
    params: z.object({
      routeId: z.string().uuid().openapi({
        description: "ID of the route",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    }),
    query: z.object({
      page: z.string().optional().openapi({
        description: "Page number (default: 1)",
        example: "1",
      }),
      limit: z.string().optional().openapi({
        description: "Items per page (default: 20, max: 100)",
        example: "20",
      }),
    }),
  },
  responses: {
    200: {
      description: "Reviews retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ReviewResponse",
                },
              },
              pagination: {
                type: "object",
                properties: {
                  page: {
                    type: "integer",
                    example: 1,
                    description: "Current page number",
                  },
                  limit: {
                    type: "integer",
                    example: 20,
                    description: "Items per page",
                  },
                  totalCount: {
                    type: "integer",
                    example: 45,
                    description: "Total number of reviews for this route",
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

// POST /api/routes/:routeId/reviews
registry.registerPath({
  method: "post",
  path: "/api/routes/{routeId}/reviews",
  tags: ["Reviews"],
  summary: "Create review",
  description:
    "Create a new review for a specific route. User can only review each route once.",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      routeId: z.string().uuid().openapi({
        description: "ID of the route to review",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateReviewBody",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Review created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/ReviewResponse",
              },
              message: {
                type: "string",
                example: "Review created successfully",
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
      description: "Conflict - User already reviewed this route",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "You have already reviewed this route",
              },
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

// GET /api/routes/:routeId/reviews
router.get(
  "/",
  validate(getRouteReviewsSchema),
  reviewsController.getRouteReviews,
);

// POST /api/routes/:routeId/reviews
router.post(
  "/",
  requireAuth,
  validate(createReviewSchema),
  reviewsController.createReview,
);

export default router;
