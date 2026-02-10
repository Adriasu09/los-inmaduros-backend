import { Router } from "express";
import { ReviewsController } from "./reviews.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import { updateReviewSchema, deleteReviewSchema } from "./reviews.validation";
import { requireAuth } from "../../shared/middlewares/auth.middleware";
import { registry } from "../../config/openapi-registry";
import { z } from "zod";

const router = Router();
const reviewsController = new ReviewsController();

/**
 * Register OpenAPI paths
 */

// GET /api/reviews/my-reviews
registry.registerPath({
  method: "get",
  path: "/api/reviews/my-reviews",
  tags: ["Reviews"],
  summary: "Get my reviews",
  description: "Get all reviews created by the authenticated user",
  security: [{ bearerAuth: [] }],
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

// PUT /api/reviews/:reviewId
registry.registerPath({
  method: "put",
  path: "/api/reviews/{reviewId}",
  tags: ["Reviews"],
  summary: "Update review",
  description: "Update an existing review. Only the owner can edit it.",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      reviewId: z.string().uuid().openapi({
        description: "ID of the review to update",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateReviewBody",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Review updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/ReviewResponse",
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
    403: {
      description: "Forbidden - Only the owner can edit this review",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Forbidden" },
            },
          },
        },
      },
    },
    404: {
      description: "Review not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Review not found" },
            },
          },
        },
      },
    },
  },
});

// DELETE /api/reviews/:reviewId
registry.registerPath({
  method: "delete",
  path: "/api/reviews/{reviewId}",
  tags: ["Reviews"],
  summary: "Delete review",
  description: "Delete a review. Only the owner or an admin can delete it.",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      reviewId: z.string().uuid().openapi({
        description: "ID of the review to delete",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    }),
  },
  responses: {
    200: {
      description: "Review deleted successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: {
                type: "string",
                example: "Review deleted successfully",
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
    403: {
      description: "Forbidden - Only owner or admin can delete",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Forbidden" },
            },
          },
        },
      },
    },
    404: {
      description: "Review not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Review not found" },
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

// GET /api/reviews/my-reviews
router.get("/my-reviews", requireAuth, reviewsController.getMyReviews);

// PUT /api/reviews/:reviewId
router.put(
  "/:reviewId",
  requireAuth,
  validate(updateReviewSchema),
  reviewsController.updateReview,
);

// DELETE /api/reviews/:reviewId
router.delete(
  "/:reviewId",
  requireAuth,
  validate(deleteReviewSchema),
  reviewsController.deleteReview,
);

export default router;
