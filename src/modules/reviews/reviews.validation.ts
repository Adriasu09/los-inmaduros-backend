import { z } from "zod";

/**
 * Schema for creating a review
 */
const createReviewBodySchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5"),
  comment: z
    .string()
    .max(500, "Comment cannot exceed 500 characters")
    .optional(),
});

/**
 * Schema for updating a review
 */
const updateReviewBodySchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5")
    .optional(),
  comment: z
    .string()
    .max(500, "Comment cannot exceed 500 characters")
    .optional(),
});

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
