import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/openapi-registry";

// Extend Zod with OpenAPI methods
extendZodWithOpenApi(z);

/**
 * Enums for validation
 */
export const PhotoContextEnum = z.enum([
  "ROUTE_CALL_COVER",
  "ROUTE_GALLERY",
  "ROUTE_CALL_GALLERY",
]);

export const PhotoStatusEnum = z.enum([
  "ACTIVE",
  "FLAGGED",
  "REJECTED",
  "DELETED",
]);

/**
 * Photo Response Schema
 */
const photoResponseSchema = registry.register(
  "PhotoResponse",
  z
    .object({
      id: z
        .string()
        .uuid()
        .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
      context: PhotoContextEnum.openapi({ example: "ROUTE_GALLERY" }),
      routeId: z
        .string()
        .uuid()
        .nullable()
        .openapi({ example: "987e6543-e21b-12d3-a456-426614174000" }),
      routeCallId: z
        .string()
        .uuid()
        .nullable()
        .openapi({ example: null }),
      userId: z.string().openapi({ example: "user_2abc123def456" }),
      imageUrl: z
        .string()
        .url()
        .openapi({
          example:
            "https://your-project.supabase.co/storage/v1/object/public/photos/routes/image.jpg",
        }),
      caption: z
        .string()
        .nullable()
        .openapi({ example: "Beautiful route!" }),
      status: PhotoStatusEnum.openapi({ example: "ACTIVE" }),
      moderatedAt: z
        .string()
        .datetime()
        .nullable()
        .openapi({ example: null }),
      moderatedBy: z.string().nullable().openapi({ example: null }),
      moderationNotes: z.string().nullable().openapi({ example: null }),
      createdAt: z
        .string()
        .datetime()
        .openapi({ example: "2026-02-10T10:00:00Z" }),
      updatedAt: z
        .string()
        .datetime()
        .openapi({ example: "2026-02-10T10:00:00Z" }),
      user: z
        .object({
          id: z.string().openapi({ example: "user_2abc123def456" }),
          name: z.string().nullable().openapi({ example: "John" }),
          imageUrl: z
            .string()
            .url()
            .nullable()
            .openapi({ example: "https://example.com/avatar.jpg" }),
        })
        .optional(),
      route: z
        .object({
          id: z.string().uuid(),
          name: z.string().openapi({ example: "Casa de Campo" }),
          slug: z.string().openapi({ example: "casa-de-campo" }),
        })
        .nullable()
        .optional(),
      routeCall: z
        .object({
          id: z.string().uuid(),
          title: z.string().openapi({ example: "Ruta Casa de Campo - Domingo" }),
        })
        .nullable()
        .optional(),
    })
    .openapi({
      description: "Photo information",
    }),
);

/**
 * Route Gallery Response Schema
 */
const routeGalleryResponseSchema = registry.register(
  "RouteGalleryResponse",
  z
    .object({
      route: z.object({
        id: z.string().uuid(),
        name: z.string().openapi({ example: "Casa de Campo" }),
      }),
      photos: z.array(photoResponseSchema),
      count: z.number().int().openapi({ example: 15 }),
    })
    .openapi({
      description: "Route gallery with photos",
    }),
);

/**
 * Route Call Gallery Response Schema
 */
const routeCallGalleryResponseSchema = registry.register(
  "RouteCallGalleryResponse",
  z
    .object({
      routeCall: z.object({
        id: z.string().uuid(),
        title: z.string().openapi({ example: "Ruta Casa de Campo - Domingo" }),
      }),
      photos: z.array(photoResponseSchema),
      count: z.number().int().openapi({ example: 8 }),
    })
    .openapi({
      description: "Route call gallery with photos",
    }),
);

/**
 * Schema for uploading a photo (multipart/form-data)
 * Note: File validation is done in middleware and service
 */
const uploadPhotoBodySchema = z
  .object({
    context: PhotoContextEnum.openapi({
      description: "Photo context (where it will be displayed)",
      example: "ROUTE_GALLERY",
    }),
    routeId: z
      .string()
      .uuid("Must be a valid UUID")
      .optional()
      .openapi({
        description: "Route ID (required for ROUTE_GALLERY)",
        example: "987e6543-e21b-12d3-a456-426614174000",
      }),
    routeCallId: z
      .string()
      .uuid("Must be a valid UUID")
      .optional()
      .openapi({
        description:
          "Route Call ID (required for ROUTE_CALL_COVER and ROUTE_CALL_GALLERY)",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    caption: z
      .string()
      .max(500, "Caption too long")
      .optional()
      .openapi({
        description: "Optional caption for the photo",
        example: "Beautiful route through the park!",
      }),
  })
  .refine((data) => {
    if (data.context === "ROUTE_GALLERY" && !data.routeId) {
      return false;
    }
    return true;
  }, "routeId is required for ROUTE_GALLERY context")
  .refine((data) => {
    if (
      (data.context === "ROUTE_CALL_COVER" ||
        data.context === "ROUTE_CALL_GALLERY") &&
      !data.routeCallId
    ) {
      return false;
    }
    return true;
  }, "routeCallId is required for ROUTE_CALL_COVER and ROUTE_CALL_GALLERY contexts")
  .refine((data) => {
    if (data.routeId && data.routeCallId) {
      return false;
    }
    return true;
  }, "Cannot provide both routeId and routeCallId");

/**
 * Schema for reject photo body
 */
const rejectPhotoBodySchema = registry.register(
  "RejectPhotoBody",
  z
    .object({
      moderationNotes: z
        .string()
        .max(500, "Notes too long")
        .optional()
        .openapi({
          description: "Optional notes about why the photo was rejected",
          example: "Inappropriate content",
        }),
    })
    .openapi({
      description: "Data for rejecting a photo",
    }),
);

/**
 * Complete schemas for use with validation middleware
 */
export const uploadPhotoSchema = z.object({
  body: uploadPhotoBodySchema,
});

export const getPhotosSchema = z.object({
  query: z.object({
    context: PhotoContextEnum.optional(),
    routeId: z.string().uuid("Must be a valid UUID").optional(),
    routeCallId: z.string().uuid("Must be a valid UUID").optional(),
    status: PhotoStatusEnum.optional(),
  }),
});

export const getRouteGallerySchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug is required"),
  }),
});

export const getRouteCallGallerySchema = z.object({
  params: z.object({
    id: z.string().uuid("Must be a valid UUID"),
  }),
});

export const updateCoverPhotoSchema = z.object({
  params: z.object({
    id: z.string().uuid("Must be a valid UUID"),
  }),
});

export const deletePhotoSchema = z.object({
  params: z.object({
    id: z.string().uuid("Must be a valid UUID"),
  }),
});

export const rejectPhotoSchema = z.object({
  params: z.object({
    id: z.string().uuid("Must be a valid UUID"),
  }),
  body: rejectPhotoBodySchema,
});

export const approvePhotoSchema = z.object({
  params: z.object({
    id: z.string().uuid("Must be a valid UUID"),
  }),
});

/**
 * Types
 */
export type UploadPhotoInput = z.infer<typeof uploadPhotoBodySchema>;
export type PhotoContext = z.infer<typeof PhotoContextEnum>;
export type PhotoStatus = z.infer<typeof PhotoStatusEnum>;

// Export schemas for OpenAPI documentation
export {
  photoResponseSchema,
  routeGalleryResponseSchema,
  routeCallGalleryResponseSchema,
  rejectPhotoBodySchema,
};