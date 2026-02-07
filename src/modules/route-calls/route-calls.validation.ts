import { z } from "zod";

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
 * Schema for creating a route call
 */
const createRouteCallBodySchema = z
  .object({
    // Route: predefined OR custom
    routeId: z.string().uuid("Must be a valid UUID").optional(),
    customRouteName: z
      .string()
      .min(1, "Custom route name is required")
      .max(200, "Custom route name too long")
      .optional(),

    // Details
    description: z.string().max(1000, "Description too long").optional(),
    image: z.string().url("Must be a valid URL").optional(),

    // Date and pace
    dateRoute: z.string().datetime("Must be a valid ISO datetime"),
    pace: RoutePaceEnum,

    // Meeting points (1 PRIMARY required, 1 SECONDARY optional)
    meetingPoints: z
      .array(meetingPointSchema)
      .min(1, "At least one meeting point is required")
      .max(2, "Maximum 2 meeting points allowed")
      .refine(
        (points) => points.some((p) => p.type === "PRIMARY"),
        "At least one PRIMARY meeting point is required",
      )
      .refine((points) => {
        const primaryCount = points.filter((p) => p.type === "PRIMARY").length;
        return primaryCount === 1;
      }, "Only one PRIMARY meeting point is allowed")
      .refine((points) => {
        const secondaryCount = points.filter(
          (p) => p.type === "SECONDARY",
        ).length;
        return secondaryCount <= 1;
      }, "Only one SECONDARY meeting point is allowed"),
  })
  .refine(
    (data) => data.routeId || data.customRouteName,
    "Either routeId or customRouteName must be provided",
  )
  .refine(
    (data) => !(data.routeId && data.customRouteName),
    "Cannot provide both routeId and customRouteName",
  );

/**
 * Schema for updating a route call
 */
const updateRouteCallBodySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long")
    .optional(),
  description: z.string().max(1000, "Description too long").optional(),
  image: z.string().url("Must be a valid URL").optional(),
  dateRoute: z.string().datetime("Must be a valid ISO datetime").optional(),
  pace: RoutePaceEnum.optional(),
  // Note: Meeting points updates will be handled separately if needed
});

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
