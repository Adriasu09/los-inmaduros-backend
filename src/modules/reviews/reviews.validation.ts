import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/openapi-registry";

// Extend Zod with OpenAPI methods
extendZodWithOpenApi(z);

/**
 * Schema for creating a review
 */
const createReviewBodySchema = registry.register(
  "CreateReviewBody",
  z
    .object({
      rating: z
        .number()
        .int("Rating must be an integer")
        .min(1, "Minimum rating is 1")
        .max(5, "Maximum rating is 5")
        .openapi({
          description: "Route rating from 1 to 5 stars",
          example: 5,
        }),
      comment: z
        .string()
        .max(500, "Comment cannot exceed 500 characters")
        .optional()
        .openapi({
          description: "Optional comment about the route",
          example:
            "Excellent route! Very well signposted and great pavement quality.",
        }),
    })
    .openapi({
      description: "Data to create a new review",
    }),
);

/**
 * Schema for updating a review
 */
const updateReviewBodySchema = registry.register(
  "UpdateReviewBody",
  z
    .object({
      rating: z
        .number()
        .int("Rating must be an integer")
        .min(1, "Minimum rating is 1")
        .max(5, "Maximum rating is 5")
        .optional()
        .openapi({
          description: "New rating (optional)",
          example: 4,
        }),
      comment: z
        .string()
        .max(500, "Comment cannot exceed 500 characters")
        .optional()
        .openapi({
          description: "New comment (optional)",
          example: "Updated my review with more details.",
        }),
    })
    .openapi({
      description: "Data to update an existing review",
    }),
);

/**
 * Review Response Schema
 */
const reviewResponseSchema = registry.register(
  "ReviewResponse",
  z
    .object({
      id: z
        .string()
        .uuid()
        .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
      routeId: z.string().uuid(),
      userId: z.string().uuid(),
      rating: z.number().int().min(1).max(5).openapi({ example: 5 }),
      comment: z.string().nullable().openapi({ example: "Excellent route!" }),
      createdAt: z
        .string()
        .datetime()
        .openapi({ example: "2026-02-09T12:00:00Z" }),
      updatedAt: z
        .string()
        .datetime()
        .openapi({ example: "2026-02-09T12:00:00Z" }),
      user: z
        .object({
          id: z.string().uuid(),
          name: z.string().nullable(),
          imageUrl: z.string().nullable(),
        })
        .optional(),
    })
    .openapi({
      description: "Route review",
    }),
);

/**
 * Complete schemas for use with validation middleware
 */
export const getRouteReviewsSchema = z.object({
  params: z.object({
    routeId: z.string().uuid("Must be a valid UUID"),
  }),
});

export const createReviewSchema = z.object({
  params: z.object({
    routeId: z.string().uuid("Must be a valid UUID"),
  }),
  body: createReviewBodySchema,
});

export const updateReviewSchema = z.object({
  params: z.object({
    reviewId: z.string().uuid("Must be a valid UUID"),
  }),
  body: updateReviewBodySchema,
});

export const deleteReviewSchema = z.object({
  params: z.object({
    reviewId: z.string().uuid("Must be a valid UUID"),
  }),
});

/**
 * Types
 */
export type CreateReviewInput = z.infer<typeof createReviewBodySchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewBodySchema>;

// Export schemas for OpenAPI documentation
export { createReviewBodySchema, updateReviewBodySchema, reviewResponseSchema };
