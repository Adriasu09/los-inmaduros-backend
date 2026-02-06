import { z } from "zod";

/**
 * Schema for adding a route to favorites
 */
export const addFavoriteSchema = z.object({
  params: z.object({
    routeId: z.string().uuid("Must be a valid UUID"),
  }),
});

/**
 * Schema for removing a route from favorites
 */
export const removeFavoriteSchema = z.object({
  params: z.object({
    routeId: z.string().uuid("Must be a valid UUID"),
  }),
});

/**
 * Schema for checking if a route is favorite
 */
export const checkFavoriteSchema = z.object({
  params: z.object({
    routeId: z.string().uuid("Must be a valid UUID"),
  }),
});
