import { Router } from "express";
import { ConfigController } from "./config.controller";
import { registry } from "../../config/openapi-registry";

const router = Router();
const configController = new ConfigController();

/**
 * Register OpenAPI paths
 */

// GET /api/config
registry.registerPath({
  method: "get",
  path: "/api/config",
  tags: ["Config"],
  summary: "Get configuration constants",
  description:
    "Get all application configuration constants including meeting points, route paces, and route levels. This endpoint is public and doesn't require authentication.",
  responses: {
    200: {
      description: "Configuration retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                $ref: "#/components/schemas/ConfigResponse",
              },
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

// GET /api/config
router.get("/", configController.getConfig);

export default router;
