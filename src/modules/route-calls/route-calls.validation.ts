import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/openapi-registry";

// Extend Zod with OpenAPI methods
extendZodWithOpenApi(z);

/**
 * Enums for validation
 */
export const RoutePaceEnum = z.enum([
  "ROCA",
  "CARACOL",
  "GUSANO",
  "MARIPOSA",
  "EXPERIMENTADO",
  "LOCURA_TOTAL",
  "MIAUCORNIA",
]);

export const RouteCallStatusEnum = z.enum([
  "SCHEDULED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
]);

export const MeetingPointTypeEnum = z.enum(["PRIMARY", "SECONDARY"]);

/**
 * Schema for meeting point
 */
const meetingPointSchema = z.object({
  type: MeetingPointTypeEnum,
  name: z.string().min(1, "Name is required"),
  customName: z.string().optional(),
  location: z.string().url("Must be a valid URL").optional(),
  time: z.string().datetime("Must be a valid ISO datetime").optional(),
});

/**
 * Meeting Point Response Schema
 */
const meetingPointResponseSchema = registry.register(
  "MeetingPointResponse",
  z
    .object({
      id: z
        .string()
        .uuid()
        .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
      type: MeetingPointTypeEnum.openapi({ example: "PRIMARY" }),
      name: z.string().openapi({ example: "Explanada" }),
      customName: z.string().nullable().openapi({ example: null }),
      location: z
        .string()
        .url()
        .nullable()
        .openapi({ example: "https://maps.app.goo.gl/gCJfpLSoy3D454Y19" }),
      time: z.string().datetime().nullable().openapi({ example: null }),
      createdAt: z
        .string()
        .datetime()
        .openapi({ example: "2026-02-10T10:00:00Z" }),
    })
    .openapi({
      description: "Meeting point information",
    }),
);

/**
 * Route Call Response Schema
 */
const routeCallResponseSchema = registry.register(
  "RouteCallResponse",
  z
    .object({
      id: z
        .string()
        .uuid()
        .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
      routeId: z
        .string()
        .uuid()
        .nullable()
        .openapi({ example: "987e6543-e21b-12d3-a456-426614174000" }),
      organizerId: z.string().openapi({ example: "user_2abc123def456" }),
      title: z.string().openapi({ example: "Ruta Casa de Campo - Domingo" }),
      description: z
        .string()
        .nullable()
        .openapi({ example: "Ruta tranquila por el parque..." }),
      image: z
        .string()
        .url()
        .openapi({ example: "https://example.com/route-call.jpg" }),
      dateRoute: z
        .string()
        .datetime()
        .openapi({ example: "2026-02-15T10:00:00Z" }),
      pace: RoutePaceEnum.openapi({ example: "MARIPOSA" }),
      status: RouteCallStatusEnum.openapi({ example: "SCHEDULED" }),
      createdAt: z
        .string()
        .datetime()
        .openapi({ example: "2026-02-10T10:00:00Z" }),
      updatedAt: z
        .string()
        .datetime()
        .openapi({ example: "2026-02-10T10:00:00Z" }),
      route: z
        .object({
          id: z.string().uuid(),
          name: z.string().openapi({ example: "Casa de Campo" }),
          slug: z.string().openapi({ example: "casa-de-campo" }),
          image: z.string().url(),
          approximateDistance: z.string().openapi({ example: "15 km" }),
          level: z
            .array(z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]))
            .openapi({ example: ["INTERMEDIATE"] }),
        })
        .nullable(),
      organizer: z.object({
        id: z.string().openapi({ example: "user_2abc123def456" }),
        name: z.string().nullable().openapi({ example: "John" }),
        imageUrl: z
          .string()
          .url()
          .nullable()
          .openapi({ example: "https://example.com/avatar.jpg" }),
      }),
      meetingPoints: z.array(meetingPointResponseSchema),
      _count: z.object({
        attendances: z.number().int().openapi({
          description: "Total number of confirmed attendances",
          example: 12,
        }),
      }),
    })
    .openapi({
      description: "Route call with full details",
    }),
);

/**
 * Schema for creating a route call
 */
const createRouteCallBodySchema = registry.register(
  "CreateRouteCallBody",
  z
    .object({
      routeId: z.string().uuid("Must be a valid UUID").optional().openapi({
        description:
          "ID of predefined route (optional - if not provided, it's a custom route)",
        example: "987e6543-e21b-12d3-a456-426614174000",
      }),
      title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title too long")
        .optional()
        .openapi({
          description:
            "Title for the route call (required for custom routes, auto-generated for predefined)",
          example: "Ruta Casa de Campo - Domingo",
        }),
      description: z
        .string()
        .max(1000, "Description too long")
        .optional()
        .openapi({
          description: "Optional description",
          example: "Ruta tranquila por el parque...",
        }),
      image: z.string().url("Must be a valid URL").optional().openapi({
        description: "Optional custom image URL",
        example: "https://example.com/my-route-call.jpg",
      }),
      dateRoute: z.string().datetime("Must be a valid ISO datetime").openapi({
        description: "Date and time of the route call",
        example: "2026-02-15T10:00:00Z",
      }),
      pace: RoutePaceEnum.openapi({ example: "MARIPOSA" }),
      meetingPoints: z
        .array(meetingPointSchema)
        .min(1, "At least one meeting point is required")
        .max(2, "Maximum 2 meeting points allowed")
        .refine(
          (points) => points.some((p) => p.type === "PRIMARY"),
          "At least one PRIMARY meeting point is required",
        )
        .refine((points) => {
          const primaryCount = points.filter(
            (p) => p.type === "PRIMARY",
          ).length;
          return primaryCount === 1;
        }, "Only one PRIMARY meeting point is allowed")
        .refine((points) => {
          const secondaryCount = points.filter(
            (p) => p.type === "SECONDARY",
          ).length;
          return secondaryCount <= 1;
        }, "Only one SECONDARY meeting point is allowed")
        .openapi({
          description:
            "Meeting points (1 PRIMARY required, 1 SECONDARY optional)",
          example: [
            {
              type: "PRIMARY",
              name: "Explanada",
              location: "https://maps.app.goo.gl/gCJfpLSoy3D454Y19",
            },
            {
              type: "SECONDARY",
              name: "Puerta de Alcalá",
              location: "https://maps.app.goo.gl/3kjrtMz9BtQ39BJYA",
              time: "2026-02-15T10:15:00Z",
            },
          ],
        }),
    })
    .refine((data) => {
      if (!data.routeId && !data.title) {
        return false;
      }
      return true;
    }, "Title is required for custom routes")
    .openapi({
      description: "Data to create a new route call",
    }),
);

/**
 * Schema for updating a route call
 */
const updateRouteCallBodySchema = registry.register(
  "UpdateRouteCallBody",
  z
    .object({
      title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title too long")
        .optional()
        .openapi({ example: "Ruta Actualizada" }),
      description: z
        .string()
        .max(1000, "Description too long")
        .optional()
        .openapi({ example: "Nueva descripción..." }),
      image: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .openapi({ example: "https://example.com/new-image.jpg" }),
      dateRoute: z
        .string()
        .datetime("Must be a valid ISO datetime")
        .optional()
        .openapi({ example: "2026-02-16T11:00:00Z" }),
      pace: RoutePaceEnum.optional().openapi({ example: "GUSANO" }),
    })
    .openapi({
      description: "Data to update a route call",
    }),
);

/**
 * Complete schemas for use with validation middleware
 */
export const createRouteCallSchema = z.object({
  body: createRouteCallBodySchema,
});

export const getRouteCallsSchema = z.object({
  query: z.object({
    status: RouteCallStatusEnum.optional(),
    organizerId: z.string().uuid("Must be a valid UUID").optional(),
    upcoming: z.enum(["true", "false"]).optional(),
    routeId: z.string().uuid("Must be a valid UUID").optional(),
  }),
});

export const getRouteCallByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Must be a valid UUID"),
  }),
});

export const updateRouteCallSchema = z.object({
  params: z.object({
    id: z.string().uuid("Must be a valid UUID"),
  }),
  body: updateRouteCallBodySchema,
});

export const cancelRouteCallSchema = z.object({
  params: z.object({
    id: z.string().uuid("Must be a valid UUID"),
  }),
});

export const deleteRouteCallSchema = z.object({
  params: z.object({
    id: z.string().uuid("Must be a valid UUID"),
  }),
});

/**
 * Types
 */
export type CreateRouteCallInput = z.infer<typeof createRouteCallBodySchema>;
export type UpdateRouteCallInput = z.infer<typeof updateRouteCallBodySchema>;
export type MeetingPointInput = z.infer<typeof meetingPointSchema>;
export type RoutePace = z.infer<typeof RoutePaceEnum>;
export type RouteCallStatus = z.infer<typeof RouteCallStatusEnum>;

// Export schemas for OpenAPI documentation
export {
  createRouteCallBodySchema,
  updateRouteCallBodySchema,
  routeCallResponseSchema,
  meetingPointResponseSchema,
};
