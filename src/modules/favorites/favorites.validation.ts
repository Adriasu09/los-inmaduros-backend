import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/openapi-registry";

// Extend Zod with OpenAPI methods
extendZodWithOpenApi(z);

/**
 * Favorite Response Schema (with route details)
 */
const favoriteResponseSchema = registry.register(
  "FavoriteResponse",
  z
    .object({
      id: z
        .string()
        .uuid()
        .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
      userId: z.string().openapi({ example: "user_2abc123def456" }),
      routeId: z
        .string()
        .uuid()
        .openapi({ example: "987e6543-e21b-12d3-a456-426614174000" }),
      createdAt: z
        .string()
        .datetime()
        .openapi({ example: "2026-02-10T10:00:00Z" }),
      route: z.object({
        id: z.string().uuid(),
        name: z.string().openapi({ example: "Casa de Campo" }),
        slug: z.string().openapi({ example: "casa-de-campo" }),
        image: z.string().url().openapi({
          example: "https://example.com/routes/casa-de-campo.jpg",
        }),
        approximateDistance: z.string().openapi({ example: "15 km" }),
        level: z
          .array(z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]))
          .openapi({ example: ["INTERMEDIATE"] }),
        description: z.string().optional(),
        _count: z
          .object({
            reviews: z.number().int().openapi({ example: 25 }),
            routeCalls: z.number().int().openapi({ example: 12 }),
          })
          .optional(),
      }),
    })
    .openapi({
      description: "Favorite with route details",
    }),
);

/**
 * Check Favorite Response Schema
 */
const checkFavoriteResponseSchema = registry.register(
  "CheckFavoriteResponse",
  z
    .object({
      isFavorite: z.boolean().openapi({
        description: "Whether the route is in user's favorites",
        example: true,
      }),
    })
    .openapi({
      description: "Favorite status check result",
    }),
);

/**
 * Complete schemas for use with validation middleware
 */
export const addFavoriteSchema = z.object({
  params: z.object({
    routeId: z.string().uuid("Must be a valid UUID"),
  }),
});

export const removeFavoriteSchema = z.object({
  params: z.object({
    routeId: z.string().uuid("Must be a valid UUID"),
  }),
});

export const checkFavoriteSchema = z.object({
  params: z.object({
    routeId: z.string().uuid("Must be a valid UUID"),
  }),
});

// Export schemas for OpenAPI documentation
export { favoriteResponseSchema, checkFavoriteResponseSchema };
