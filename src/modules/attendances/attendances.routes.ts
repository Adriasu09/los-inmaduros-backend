import { Router } from "express";
import { AttendancesController } from "./attendances.controller";
import { requireAuth } from "../../shared/middlewares/auth.middleware";
import { registry } from "../../config/openapi-registry";

const router = Router();
const attendancesController = new AttendancesController();

/**
 * Register OpenAPI paths
 */

// GET /api/attendances/my-attendances
registry.registerPath({
  method: "get",
  path: "/api/attendances/my-attendances",
  tags: ["Attendances"],
  summary: "Get my attendances",
  description:
    "Get all confirmed attendances for the authenticated user with full route call details",
  security: [{ bearerAuth: [] }],
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
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      format: "uuid",
                      example: "123e4567-e89b-12d3-a456-426614174000",
                    },
                    userId: {
                      type: "string",
                      example: "user_2abc123def456",
                    },
                    routeCallId: {
                      type: "string",
                      format: "uuid",
                      example: "987e6543-e21b-12d3-a456-426614174000",
                    },
                    status: {
                      type: "string",
                      enum: ["CONFIRMED", "CANCELLED"],
                      example: "CONFIRMED",
                    },
                    createdAt: {
                      type: "string",
                      format: "date-time",
                      example: "2026-02-10T10:00:00Z",
                    },
                    updatedAt: {
                      type: "string",
                      format: "date-time",
                      example: "2026-02-10T10:00:00Z",
                    },
                    routeCall: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          format: "uuid",
                        },
                        title: {
                          type: "string",
                          example: "Ruta Casa de Campo - Domingo",
                        },
                        dateRoute: {
                          type: "string",
                          format: "date-time",
                          example: "2026-02-15T10:00:00Z",
                        },
                        pace: {
                          type: "string",
                          enum: [
                            "ROCA",
                            "CARACOL",
                            "GUSANO",
                            "MARIPOSA",
                            "EXPERIMENTADO",
                            "LOCURA_TOTAL",
                            "MIAUCORNIA",
                          ],
                          example: "MARIPOSA",
                        },
                        status: {
                          type: "string",
                          enum: [
                            "SCHEDULED",
                            "ONGOING",
                            "COMPLETED",
                            "CANCELLED",
                          ],
                          example: "SCHEDULED",
                        },
                        route: {
                          type: "object",
                          nullable: true,
                          properties: {
                            id: { type: "string", format: "uuid" },
                            name: {
                              type: "string",
                              example: "Casa de Campo",
                            },
                            slug: {
                              type: "string",
                              example: "casa-de-campo",
                            },
                            image: {
                              type: "string",
                              format: "uri",
                            },
                            approximateDistance: {
                              type: "string",
                              example: "15 km",
                            },
                            level: {
                              type: "array",
                              items: {
                                type: "string",
                                enum: [
                                  "BEGINNER",
                                  "INTERMEDIATE",
                                  "ADVANCED",
                                  "EXPERT",
                                ],
                              },
                              example: ["INTERMEDIATE"],
                            },
                          },
                        },
                        organizer: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            name: {
                              type: "string",
                              nullable: true,
                              example: "John",
                            },
                            imageUrl: {
                              type: "string",
                              format: "uri",
                              nullable: true,
                            },
                          },
                        },
                        meetingPoints: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "string", format: "uuid" },
                              type: {
                                type: "string",
                                enum: ["PRIMARY", "SECONDARY"],
                              },
                              name: { type: "string" },
                              customName: {
                                type: "string",
                                nullable: true,
                              },
                              location: {
                                type: "string",
                                format: "uri",
                                nullable: true,
                              },
                              time: {
                                type: "string",
                                format: "date-time",
                                nullable: true,
                              },
                            },
                          },
                        },
                        _count: {
                          type: "object",
                          properties: {
                            attendances: {
                              type: "integer",
                              example: 12,
                              description: "Total confirmed attendances",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              count: {
                type: "integer",
                example: 5,
                description: "Total number of user's confirmed attendances",
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

/**
 * Express routes
 */

// GET /api/attendances/my-attendances
router.get(
  "/my-attendances",
  requireAuth,
  attendancesController.getUserAttendances,
);

export default router;
