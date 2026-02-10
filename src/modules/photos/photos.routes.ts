import { Router } from "express";
import { PhotosController } from "./photos.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import {
  uploadPhotoSchema,
  getPhotosSchema,
  getRouteGallerySchema,
  getRouteCallGallerySchema,
  updateCoverPhotoSchema,
  deletePhotoSchema,
  rejectPhotoSchema,
  approvePhotoSchema,
} from "./photos.validation";
import {
  requireAuth,
  requireAdmin,
} from "../../shared/middlewares/auth.middleware";
import { upload } from "../../shared/middlewares/upload.middleware";
import { registry } from "../../config/openapi-registry";
import { z } from "zod";

// Import schemas to register them in OpenAPI registry
import {
  PhotoContextEnum,
  PhotoStatusEnum,
} from "./photos.validation";

const router = Router();
const photosController = new PhotosController();

/**
 * Register OpenAPI paths
 */

// POST /api/photos
registry.registerPath({
  method: "post",
  path: "/api/photos",
  tags: ["Photos"],
  summary: "Upload photo",
  description:
    "Upload a photo to a route gallery, route call cover, or route call gallery. Context-based permissions apply.",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              image: {
                type: "string",
                format: "binary",
                description: "Image file (JPEG, PNG, GIF, WebP - max 5MB)",
              },
              context: {
                type: "string",
                enum: [
                  "ROUTE_CALL_COVER",
                  "ROUTE_GALLERY",
                  "ROUTE_CALL_GALLERY",
                ],
                description: "Photo context",
                example: "ROUTE_GALLERY",
              },
              routeId: {
                type: "string",
                format: "uuid",
                description: "Route ID (required for ROUTE_GALLERY)",
                example: "987e6543-e21b-12d3-a456-426614174000",
              },
              routeCallId: {
                type: "string",
                format: "uuid",
                description:
                  "Route Call ID (required for ROUTE_CALL_COVER and ROUTE_CALL_GALLERY)",
                example: "123e4567-e89b-12d3-a456-426614174000",
              },
              caption: {
                type: "string",
                maxLength: 500,
                description: "Optional caption",
                example: "Beautiful route!",
              },
            },
            required: ["image", "context"],
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Photo uploaded successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/PhotoResponse",
              },
              message: {
                type: "string",
                example: "Photo uploaded successfully",
              },
            },
          },
        },
      },
    },
    400: {
      description: "Bad Request - Invalid file or missing data",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "No file uploaded",
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
      description: "Forbidden - Insufficient permissions",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "Only the organizer can upload a cover photo",
              },
            },
          },
        },
      },
    },
    404: {
      description: "Route or Route Call not found",
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

// GET /api/photos
registry.registerPath({
  method: "get",
  path: "/api/photos",
  tags: ["Photos"],
  summary: "Get photos",
  description:
    "Get public gallery photos with optional filters. Only ACTIVE photos by default. Public endpoint.",
  request: {
    query: z.object({
      context: PhotoContextEnum.optional().openapi({
        description: "Filter by photo context",
        example: "ROUTE_GALLERY",
      }),
      routeId: z.string().uuid().optional().openapi({
        description: "Filter by route ID",
        example: "987e6543-e21b-12d3-a456-426614174000",
      }),
      routeCallId: z.string().uuid().optional().openapi({
        description: "Filter by route call ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
      status: PhotoStatusEnum.optional().openapi({
        description: "Filter by status (default: ACTIVE)",
        example: "ACTIVE",
      }),
    }),
  },
  responses: {
    200: {
      description: "Photos retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/PhotoResponse",
                },
              },
              count: {
                type: "integer",
                example: 25,
                description: "Total number of photos",
              },
            },
          },
        },
      },
    },
  },
});

// GET /api/photos/my-photos
registry.registerPath({
  method: "get",
  path: "/api/photos/my-photos",
  tags: ["Photos"],
  summary: "Get my photos",
  description:
    "Get all photos uploaded by the authenticated user (all statuses)",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Photos retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/PhotoResponse",
                },
              },
              count: {
                type: "integer",
                example: 10,
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

// GET /api/photos/pending-review
registry.registerPath({
  method: "get",
  path: "/api/photos/pending-review",
  tags: ["Photos"],
  summary: "Get pending photos (Admin)",
  description: "Get all photos pending moderation review. Admin only.",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Pending photos retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/PhotoResponse",
                },
              },
              count: {
                type: "integer",
                example: 5,
              },
            },
          },
        },
      },
    },
    401: {
      description: "Unauthorized",
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
      description: "Forbidden - Admin only",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Admin access required" },
            },
          },
        },
      },
    },
  },
});

// PATCH /api/photos/:id/approve
registry.registerPath({
  method: "patch",
  path: "/api/photos/{id}/approve",
  tags: ["Photos"],
  summary: "Approve photo (Admin)",
  description: "Approve a photo explicitly. Admin only.",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid().openapi({
        description: "Photo ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    }),
  },
  responses: {
    200: {
      description: "Photo approved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/PhotoResponse",
              },
              message: {
                type: "string",
                example: "Photo approved successfully",
              },
            },
          },
        },
      },
    },
    401: {
      description: "Unauthorized",
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
      description: "Forbidden - Admin only",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Admin access required" },
            },
          },
        },
      },
    },
    404: {
      description: "Photo not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Photo not found" },
            },
          },
        },
      },
    },
  },
});

// PATCH /api/photos/:id/reject
registry.registerPath({
  method: "patch",
  path: "/api/photos/{id}/reject",
  tags: ["Photos"],
  summary: "Reject photo (Admin)",
  description: "Reject a photo with optional moderation notes. Admin only.",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid().openapi({
        description: "Photo ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/RejectPhotoBody",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Photo rejected successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/PhotoResponse",
              },
              message: {
                type: "string",
                example: "Photo rejected successfully",
              },
            },
          },
        },
      },
    },
    401: {
      description: "Unauthorized",
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
      description: "Forbidden - Admin only",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Admin access required" },
            },
          },
        },
      },
    },
    404: {
      description: "Photo not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Photo not found" },
            },
          },
        },
      },
    },
  },
});

// DELETE /api/photos/:id
registry.registerPath({
  method: "delete",
  path: "/api/photos/{id}",
  tags: ["Photos"],
  summary: "Delete photo",
  description: "Delete a photo. Owner or admin only.",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid().openapi({
        description: "Photo ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    }),
  },
  responses: {
    200: {
      description: "Photo deleted successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: {
                type: "string",
                example: "Photo deleted successfully",
              },
            },
          },
        },
      },
    },
    401: {
      description: "Unauthorized",
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
              error: {
                type: "string",
                example: "You can only delete your own photos",
              },
            },
          },
        },
      },
    },
    404: {
      description: "Photo not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Photo not found" },
            },
          },
        },
      },
    },
  },
});

// GET /api/routes/:slug/gallery
registry.registerPath({
  method: "get",
  path: "/api/routes/{slug}/gallery",
  tags: ["Photos"],
  summary: "Get route gallery",
  description: "Get all photos for a specific route gallery. Public endpoint.",
  request: {
    params: z.object({
      slug: z.string().openapi({
        description: "Route slug",
        example: "casa-de-campo",
      }),
    }),
  },
  responses: {
    200: {
      description: "Route gallery retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/RouteGalleryResponse",
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

// GET /api/route-calls/:id/gallery
registry.registerPath({
  method: "get",
  path: "/api/route-calls/{id}/gallery",
  tags: ["Photos"],
  summary: "Get route call gallery",
  description:
    "Get all photos for a specific route call gallery. Public endpoint.",
  request: {
    params: z.object({
      id: z.string().uuid().openapi({
        description: "Route call ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    }),
  },
  responses: {
    200: {
      description: "Route call gallery retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/RouteCallGalleryResponse",
              },
            },
          },
        },
      },
    },
    404: {
      description: "Route call not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Route call not found" },
            },
          },
        },
      },
    },
  },
});

// PATCH /api/route-calls/:id/cover-photo
registry.registerPath({
  method: "patch",
  path: "/api/route-calls/{id}/cover-photo",
  tags: ["Photos"],
  summary: "Update route call cover photo",
  description: "Update the cover photo for a route call. Organizer only.",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid().openapi({
        description: "Route call ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    }),
    body: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              image: {
                type: "string",
                format: "binary",
                description: "Image file (JPEG, PNG, GIF, WebP - max 5MB)",
              },
            },
            required: ["image"],
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Cover photo updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/PhotoResponse",
              },
              message: {
                type: "string",
                example: "Cover photo updated successfully",
              },
            },
          },
        },
      },
    },
    400: {
      description: "Bad Request - No file uploaded",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "No file uploaded",
              },
            },
          },
        },
      },
    },
    401: {
      description: "Unauthorized",
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
      description: "Forbidden - Only organizer can update",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "Only the organizer can update the cover photo",
              },
            },
          },
        },
      },
    },
    404: {
      description: "Route call not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Route call not found" },
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

// POST /api/photos
router.post(
  "/",
  requireAuth,
  upload.single("image"), // Multer middleware - expects field name "image"
  validate(uploadPhotoSchema),
  photosController.uploadPhoto,
);

// GET /api/photos
router.get("/", validate(getPhotosSchema), photosController.getPhotos);

// GET /api/photos/my-photos
router.get("/my-photos", requireAuth, photosController.getUserPhotos);

// GET /api/photos/pending-review
router.get(
  "/pending-review",
  requireAuth,
  requireAdmin,
  photosController.getPendingPhotos,
);

// PATCH /api/photos/:id/approve
router.patch(
  "/:id/approve",
  requireAuth,
  requireAdmin,
  validate(approvePhotoSchema),
  photosController.approvePhoto,
);

// PATCH /api/photos/:id/reject
router.patch(
  "/:id/reject",
  requireAuth,
  requireAdmin,
  validate(rejectPhotoSchema),
  photosController.rejectPhoto,
);

// DELETE /api/photos/:id
router.delete(
  "/:id",
  requireAuth,
  validate(deletePhotoSchema),
  photosController.deletePhoto,
);

// GET /api/routes/:slug/gallery
router.get(
  "/routes/:slug/gallery",
  validate(getRouteGallerySchema),
  photosController.getRouteGallery,
);

// GET /api/route-calls/:id/gallery
router.get(
  "/route-calls/:id/gallery",
  validate(getRouteCallGallerySchema),
  photosController.getRouteCallGallery,
);

// PATCH /api/route-calls/:id/cover-photo
router.patch(
  "/route-calls/:id/cover-photo",
  requireAuth,
  upload.single("image"), // Multer middleware - expects field name "image"
  validate(updateCoverPhotoSchema),
  photosController.updateCoverPhoto,
);

export default router;
