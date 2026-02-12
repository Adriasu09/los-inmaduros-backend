import { Router } from "express";
import { RouteCallsController } from "./route-calls.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import {
  createRouteCallSchema,
  getRouteCallsSchema,
  getRouteCallByIdSchema,
  updateRouteCallSchema,
  cancelRouteCallSchema,
  deleteRouteCallSchema,
} from "./route-calls.validation";
import {
  requireAuth,
  requireAdmin,
} from "../../shared/middlewares/auth.middleware";
import { registry } from "../../config/openapi-registry";
import { z } from "zod";

// Import schemas to register them in OpenAPI registry
import {
  createRouteCallBodySchema,
  updateRouteCallBodySchema,
  routeCallResponseSchema,
  RouteCallStatusEnum,
} from "./route-calls.validation";

const router = Router();
const routeCallsController = new RouteCallsController();

/**
 * Register OpenAPI paths
 */

// POST /api/route-calls
registry.registerPath({
  method: "post",
  path: "/api/route-calls",
  tags: ["Route Calls"],
  summary: "Create route call",
  description:
    "Create a new route call with a predefined route or custom route. Requires authentication.",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateRouteCallBody",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Route call created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/RouteCallResponse",
              },
              message: {
                type: "string",
                example: "Route call created successfully",
              },
            },
          },
        },
      },
    },
    400: {
      description: "Bad Request - Validation error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "Title is required for custom routes",
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
      description: "Route not found (when routeId is provided)",
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

// GET /api/route-calls
registry.registerPath({
  method: "get",
  path: "/api/route-calls",
  tags: ["Route Calls"],
  summary: "Get all route calls",
  description:
    "Get all route calls with optional filters and pagination. Default: 20 items per page, max 100. Public endpoint.",
  request: {
    query: z.object({
      status: RouteCallStatusEnum.optional().openapi({
        description: "Filter by status",
        example: "SCHEDULED",
      }),
      organizerId: z.string().uuid().optional().openapi({
        description: "Filter by organizer ID",
        example: "user_2abc123def456",
      }),
      upcoming: z.enum(["true", "false"]).optional().openapi({
        description: "Filter by upcoming (true) or past (false) route calls",
        example: "true",
      }),
      routeId: z.string().uuid().optional().openapi({
        description: "Filter by route ID",
        example: "987e6543-e21b-12d3-a456-426614174000",
      }),
      page: z.string().optional().openapi({
        description: "Page number (default: 1)",
        example: "1",
      }),
      limit: z.string().optional().openapi({
        description: "Items per page (default: 20, max: 100)",
        example: "20",
      }),
    }),
  },
  responses: {
    200: {
      description: "Route calls retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/RouteCallResponse",
                },
              },
              pagination: {
                type: "object",
                properties: {
                  page: {
                    type: "integer",
                    example: 1,
                    description: "Current page number",
                  },
                  limit: {
                    type: "integer",
                    example: 20,
                    description: "Items per page",
                  },
                  totalCount: {
                    type: "integer",
                    example: 45,
                    description: "Total number of route calls matching filters",
                  },
                  totalPages: {
                    type: "integer",
                    example: 3,
                    description: "Total number of pages",
                  },
                  hasNextPage: {
                    type: "boolean",
                    example: true,
                    description: "Whether there is a next page",
                  },
                  hasPreviousPage: {
                    type: "boolean",
                    example: false,
                    description: "Whether there is a previous page",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});

// GET /api/route-calls/:id
registry.registerPath({
  method: "get",
  path: "/api/route-calls/{id}",
  tags: ["Route Calls"],
  summary: "Get route call by ID",
  description:
    "Get detailed information about a specific route call. Public endpoint.",
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
      description: "Route call retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/RouteCallResponse",
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

// PUT /api/route-calls/:id
registry.registerPath({
  method: "put",
  path: "/api/route-calls/{id}",
  tags: ["Route Calls"],
  summary: "Update route call",
  description: "Update a route call. Only the organizer can update it.",
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
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateRouteCallBody",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Route call updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/RouteCallResponse",
              },
              message: {
                type: "string",
                example: "Route call updated successfully",
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
      description: "Forbidden - Only organizer can update",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "Only the organizer can update this route call",
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

// PATCH /api/route-calls/:id/cancel
registry.registerPath({
  method: "patch",
  path: "/api/route-calls/{id}/cancel",
  tags: ["Route Calls"],
  summary: "Cancel route call",
  description: "Cancel a route call. Organizer or admin only.",
  security: [{ bearerAuth: [] }],
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
      description: "Route call cancelled successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/RouteCallResponse",
              },
              message: {
                type: "string",
                example: "Route call cancelled successfully",
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
      description: "Forbidden - Only organizer or admin can cancel",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "Only organizer or admin can cancel this route call",
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

// DELETE /api/route-calls/:id
registry.registerPath({
  method: "delete",
  path: "/api/route-calls/{id}",
  tags: ["Route Calls"],
  summary: "Delete route call",
  description: "Permanently delete a route call. Organizer or admin only.",
  security: [{ bearerAuth: [] }],
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
      description: "Route call deleted successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: {
                type: "string",
                example: "Route call deleted successfully",
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
      description: "Forbidden - Only organizer or admin can delete",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "Only organizer or admin can delete this route call",
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

// POST /api/route-calls
router.post(
  "/",
  requireAuth,
  validate(createRouteCallSchema),
  routeCallsController.createRouteCall,
);

// GET /api/route-calls
router.get(
  "/",
  validate(getRouteCallsSchema),
  routeCallsController.getRouteCalls,
);

// GET /api/route-calls/:id
router.get(
  "/:id",
  validate(getRouteCallByIdSchema),
  routeCallsController.getRouteCallById,
);

// PUT /api/route-calls/:id
router.put(
  "/:id",
  requireAuth,
  validate(updateRouteCallSchema),
  routeCallsController.updateRouteCall,
);

// PATCH /api/route-calls/:id/cancel
router.patch(
  "/:id/cancel",
  requireAuth,
  validate(cancelRouteCallSchema),
  routeCallsController.cancelRouteCall,
);

// DELETE /api/route-calls/:id
router.delete(
  "/:id",
  requireAuth,
  validate(deleteRouteCallSchema),
  routeCallsController.deleteRouteCall,
);

export default router;
