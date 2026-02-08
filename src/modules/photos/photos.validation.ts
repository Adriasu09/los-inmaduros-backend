import { z } from "zod";

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
 * Schema for uploading a photo
 */
const uploadPhotoBodySchema = z
  .object({
    context: PhotoContextEnum,
    routeId: z.string().uuid("Must be a valid UUID").optional(),
    routeCallId: z.string().uuid("Must be a valid UUID").optional(),
    imageUrl: z.string().url("Must be a valid URL"),
    caption: z.string().max(500, "Caption too long").optional(),
  })
  .refine((data) => {
    // ROUTE_GALLERY requires routeId
    if (data.context === "ROUTE_GALLERY" && !data.routeId) {
      return false;
    }
    return true;
  }, "routeId is required for ROUTE_GALLERY context")
  .refine((data) => {
    // ROUTE_CALL_COVER and ROUTE_CALL_GALLERY require routeCallId
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
    // Cannot provide both routeId and routeCallId
    if (data.routeId && data.routeCallId) {
      return false;
    }
    return true;
  }, "Cannot provide both routeId and routeCallId");

/**
 * Schema for updating route call cover photo
 */
const updateCoverPhotoBodySchema = z.object({
  imageUrl: z.string().url("Must be a valid URL"),
});

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
  body: updateCoverPhotoBodySchema,
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
  body: z.object({
    moderationNotes: z.string().max(500, "Notes too long").optional(),
  }),
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
export type UpdateCoverPhotoInput = z.infer<typeof updateCoverPhotoBodySchema>;
export type PhotoContext = z.infer<typeof PhotoContextEnum>;
export type PhotoStatus = z.infer<typeof PhotoStatusEnum>;
