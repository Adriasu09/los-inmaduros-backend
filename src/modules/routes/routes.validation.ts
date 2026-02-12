import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/openapi-registry";

// Extend Zod with OpenAPI methods
extendZodWithOpenApi(z);

export const RouteLevelEnum = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);

export type RouteLevel = z.infer<typeof RouteLevelEnum>;

/**
 * Route Response Schema (basic - for list)
 */
const routeBasicResponseSchema = registry.register(
  "RouteBasicResponse",
  z
    .object({
      id: z
        .string()
        .uuid()
        .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
      name: z.string().openapi({ example: "Casa de Campo" }),
      slug: z.string().openapi({ example: "casa-de-campo" }),
      image: z.string().url().openapi({
        example: "https://example.com/routes/casa-de-campo.jpg",
      }),
      approximateDistance: z.string().openapi({ example: "15 km" }),
      description: z.string().openapi({
        example: "Beautiful route through Casa de Campo park...",
      }),
      gpxFileUrl: z
        .string()
        .url()
        .nullable()
        .openapi({ example: "https://example.com/gpx/casa-de-campo.gpx" }),
      mapEmbedUrl: z.string().url().nullable().openapi({
        example: "https://www.google.com/maps/embed?pb=...",
      }),
      level: z
        .array(RouteLevelEnum)
        .openapi({ example: ["INTERMEDIATE", "ADVANCED"] }),
      createdAt: z
        .string()
        .datetime()
        .openapi({ example: "2024-01-01T00:00:00Z" }),
      updatedAt: z
        .string()
        .datetime()
        .openapi({ example: "2024-01-01T00:00:00Z" }),
      averageRating: z.number().openapi({
        description: "Average rating from reviews (0-5)",
        example: 4.5,
      }),
      _count: z.object({
        reviews: z.number().int().openapi({ example: 25 }),
        favorites: z.number().int().openapi({ example: 42 }),
        routeCalls: z.number().int().openapi({ example: 15 }),
        photos: z.number().int().openapi({ example: 30 }),
      }),
    })
    .openapi({
      description: "Route with basic information and counts",
    }),
);

/**
 * Route Response Schema (detailed - for single route)
 */
const routeDetailedResponseSchema = registry.register(
  "RouteDetailedResponse",
  z
    .object({
      id: z.string().uuid(),
      name: z.string().openapi({ example: "Casa de Campo" }),
      slug: z.string().openapi({ example: "casa-de-campo" }),
      image: z.string().url(),
      approximateDistance: z.string().openapi({ example: "15 km" }),
      description: z.string(),
      gpxFileUrl: z.string().url().nullable(),
      mapEmbedUrl: z.string().url().nullable(),
      level: z.array(RouteLevelEnum),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      averageRating: z.number().openapi({
        description: "Average rating from reviews (0-5)",
        example: 4.5,
      }),
      reviews: z.array(
        z.object({
          id: z.string().uuid(),
          rating: z.number().int().min(1).max(5),
          comment: z.string().nullable(),
          createdAt: z.string().datetime(),
          user: z.object({
            id: z.string(),
            name: z.string().nullable(),
            imageUrl: z.string().url().nullable(),
          }),
        }),
      ),
      photos: z.array(
        z.object({
          id: z.string().uuid(),
          imageUrl: z.string().url(),
          caption: z.string().nullable(),
          createdAt: z.string().datetime(),
        }),
      ),
      _count: z.object({
        favorites: z.number().int(),
        routeCalls: z.number().int(),
      }),
    })
    .openapi({
      description: "Route with full details including reviews and photos",
    }),
);

/**
 * Schema for validating route slug parameter
 * Used with validation middleware
 */
export const getRouteBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug is required"),
  }),
  query: z.object({
    reviewsPage: z
      .string()
      .regex(/^\d+$/, "Reviews page must be a positive number")
      .transform(Number)
      .refine((n) => n >= 1, "Reviews page must be at least 1")
      .optional(),
    reviewsLimit: z
      .string()
      .regex(/^\d+$/, "Reviews limit must be a positive number")
      .transform(Number)
      .refine(
        (n) => n >= 1 && n <= 100,
        "Reviews limit must be between 1 and 100",
      )
      .optional(),
    photosLimit: z
      .string()
      .regex(/^\d+$/, "Photos limit must be a positive number")
      .transform(Number)
      .refine(
        (n) => n >= 1 && n <= 100,
        "Photos limit must be between 1 and 100",
      )
      .optional(),
  }),
});

export type GetRouteBySlugInput = z.infer<typeof getRouteBySlugSchema>;

// Export schemas for OpenAPI documentation
export { routeBasicResponseSchema, routeDetailedResponseSchema };
