import { z } from "zod";

export const RouteLevelEnum = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);

export type RouteLevel = z.infer<typeof RouteLevelEnum>;

/**
 * Schema for validating route slug parameter
 * Used with validation middleware
 */
export const getRouteBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug is required"),
  }),
});

export type GetRouteBySlugInput = z.infer<typeof getRouteBySlugSchema>;