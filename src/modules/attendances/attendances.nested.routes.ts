import { Router } from "express";
import { AttendancesController } from "./attendances.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import {
  confirmAttendanceSchema,
  cancelAttendanceSchema,
  getRouteCallAttendancesSchema,
} from "./attendances.validation";
import { requireAuth } from "../../shared/middlewares/auth.middleware";
import { creationLimiter } from "../../shared/middlewares/rate-limit.middleware";
import { registry } from "../../config/openapi-registry";
import { z } from "zod";

const router = Router({ mergeParams: true });
const attendancesController = new AttendancesController();

/**
 * Register OpenAPI paths for nested routes
 */

// POST /api/route-calls/:routeCallId/attendances
registry.registerPath({
  method: "post",
  path: "/api/route-calls/{routeCallId}/attendances",
  tags: ["Attendances"],
  summary: "Confirm attendance",
  description:
    "Confirm attendance to a route call. If user previously cancelled, it will reactivate the attendance.",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      routeCallId: z.string().uuid().openapi({
        description: "ID of the route call to attend",
        example: "987e6543-e21b-12d3-a456-426614174000",
      }),
    }),
  },
  responses: {
    201: {
      description: "Attendance confirmed successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/AttendanceResponse",
              },
              message: {
                type: "string",
                example: "Attendance confirmed successfully",
              },
            },
          },
        },
      },
    },
    400: {
      description: "Bad Request - Cannot attend cancelled/completed route call",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "Cannot attend a cancelled route call",
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
    409: {
      description: "Conflict - Already attending this route call",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "You are already attending this route call",
              },
            },
          },
        },
      },
    },
  },
});

// DELETE /api/route-calls/:routeCallId/attendances
registry.registerPath({
  method: "delete",
  path: "/api/route-calls/{routeCallId}/attendances",
  tags: ["Attendances"],
  summary: "Cancel attendance",
  description:
    "Cancel your attendance to a route call. Only your own attendance can be cancelled.",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      routeCallId: z.string().uuid().openapi({
        description: "ID of the route call",
        example: "987e6543-e21b-12d3-a456-426614174000",
      }),
    }),
  },
  responses: {
    200: {
      description: "Attendance cancelled successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/AttendanceResponse",
              },
              message: {
                type: "string",
                example: "Attendance cancelled successfully",
              },
            },
          },
        },
      },
    },
    400: {
      description: "Bad Request - Attendance already cancelled",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "Attendance is already cancelled",
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
    404: {
      description: "Attendance not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Attendance not found" },
            },
          },
        },
      },
    },
  },
});

// GET /api/route-calls/:routeCallId/attendances
registry.registerPath({
  method: "get",
  path: "/api/route-calls/{routeCallId}/attendances",
  tags: ["Attendances"],
  summary: "Get route call attendances",
  description:
    "Get all confirmed attendances for a specific route call. Public endpoint.",
  request: {
    params: z.object({
      routeCallId: z.string().uuid().openapi({
        description: "ID of the route call",
        example: "987e6543-e21b-12d3-a456-426614174000",
      }),
    }),
  },
  responses: {
    200: {
      description: "Attendances retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/AttendanceResponse",
                },
              },
              count: {
                type: "integer",
                example: 12,
                description: "Total number of confirmed attendances",
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

// POST /api/route-calls/:routeCallId/attendances
router.post(
  "/",
  requireAuth,
  creationLimiter,
  validate(confirmAttendanceSchema),
  attendancesController.confirmAttendance,
);

// DELETE /api/route-calls/:routeCallId/attendances
router.delete(
  "/",
  requireAuth,
  validate(cancelAttendanceSchema),
  attendancesController.cancelAttendance,
);

// GET /api/route-calls/:routeCallId/attendances
router.get(
  "/",
  validate(getRouteCallAttendancesSchema),
  attendancesController.getRouteCallAttendances,
);

export default router;
