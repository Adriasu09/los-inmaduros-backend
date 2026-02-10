import { Router, Request, Response } from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { registry } from "../../config/openapi-registry";

const router = Router();

/**
 * Register OpenAPI paths
 */

// POST /api/auth/test-token
registry.registerPath({
  method: "post",
  path: "/api/auth/test-token",
  tags: ["Auth"],
  summary: "Generate test token (DEVELOPMENT ONLY)",
  description:
    "Generate a JWT token for a user registered in Clerk. This endpoint is for development and testing purposes only and should be removed in production.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/TestTokenBody",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Test token generated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: {
                type: "string",
                example: "Test token generated successfully",
              },
              data: {
                $ref: "#/components/schemas/TestTokenResponse",
              },
            },
          },
        },
      },
    },
    400: {
      description: "Bad Request - Email is required",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "Email is required",
              },
            },
          },
        },
      },
    },
    404: {
      description: "User not found in Clerk",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example:
                  "User not found. Create user in Clerk dashboard first.",
              },
            },
          },
        },
      },
    },
    500: {
      description: "Internal Server Error - Failed to generate token",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: {
                type: "string",
                example: "Failed to generate test token",
              },
              details: {
                type: "array",
                items: { type: "object" },
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

// POST /api/auth/test-token
router.post("/test-token", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    // Find user by email
    const users = await clerkClient.users.getUserList({
      emailAddress: [email],
    });

    if (!users || users.data.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found. Create user in Clerk dashboard first.",
      });
    }

    const user = users.data[0];

    // Create a session for the user
    const session = await clerkClient.sessions.createSession({
      userId: user.id,
    });

    // Get the JWT token from the session using your custom template
    const tokenResponse = await clerkClient.sessions.getToken(
      session.id,
      "testing-template",
    );

    // Extract the JWT string from the response
    const token =
      typeof tokenResponse === "string" ? tokenResponse : tokenResponse.jwt;

    res.json({
      success: true,
      message: "Test token generated successfully",
      data: {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        sessionId: session.id,
        token: token,
        warning: "This endpoint should be removed in production",
        instructions:
          "Copy this token and use it in Postman: Authorization: Bearer <token>",
      },
    });
  } catch (error: any) {
    console.error("Error generating test token:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate test token",
      details: error.errors || [],
    });
  }
});

export default router;
