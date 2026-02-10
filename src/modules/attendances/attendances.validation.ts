import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/openapi-registry";

// Extend Zod with OpenAPI methods
extendZodWithOpenApi(z);

/**
 * Attendance Response Schema
 */
const attendanceResponseSchema = registry.register(
  "AttendanceResponse",
  z
    .object({
      id: z
        .string()
        .uuid()
        .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
      userId: z.string().openapi({ example: "user_2abc123def456" }),
      routeCallId: z
        .string()
        .uuid()
        .openapi({ example: "987e6543-e21b-12d3-a456-426614174000" }),
      status: z
        .enum(["CONFIRMED", "CANCELLED"])
        .openapi({ example: "CONFIRMED" }),
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
          lastName: z.string().nullable().openapi({ example: "Doe" }),
          imageUrl: z
            .string()
            .url()
            .nullable()
            .openapi({ example: "https://example.com/avatar.jpg" }),
        })
        .optional(),
      routeCall: z
        .object({
          id: z
            .string()
            .uuid()
            .openapi({ example: "987e6543-e21b-12d3-a456-426614174000" }),
          title: z
            .string()
            .openapi({ example: "Ruta Casa de Campo - Domingo" }),
          dateRoute: z
            .string()
            .datetime()
            .openapi({ example: "2026-02-15T10:00:00Z" }),
          pace: z
            .enum([
              "ROCA",
              "CARACOL",
              "GUSANO",
              "MARIPOSA",
              "EXPERIMENTADO",
              "LOCURA_TOTAL",
              "MIAUCORNIA",
            ])
            .optional()
            .openapi({ example: "MARIPOSA" }),
          status: z
            .enum(["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"])
            .optional()
            .openapi({ example: "SCHEDULED" }),
        })
        .optional(),
    })
    .openapi({
      description: "Attendance information",
    }),
);

/**
 * Complete schemas for use with validation middleware
 */
export const confirmAttendanceSchema = z.object({
  params: z.object({
    routeCallId: z.string().uuid("Must be a valid UUID"),
  }),
});

export const cancelAttendanceSchema = z.object({
  params: z.object({
    routeCallId: z.string().uuid("Must be a valid UUID"),
  }),
});

export const getRouteCallAttendancesSchema = z.object({
  params: z.object({
    routeCallId: z.string().uuid("Must be a valid UUID"),
  }),
});

// Export schemas for OpenAPI documentation
export { attendanceResponseSchema };
