import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/openapi-registry";

// Extend Zod with OpenAPI methods
extendZodWithOpenApi(z);

/**
 * Request body schema for test token
 */
const testTokenBodySchema = registry.register(
  "TestTokenBody",
  z
    .object({
      email: z.string().email("Must be a valid email").openapi({
        description: "Email of the user registered in Clerk",
        example: "test@example.com",
      }),
    })
    .openapi({
      description: "Data to generate a test token",
    }),
);

/**
 * Test Token Response Schema
 */
const testTokenResponseSchema = registry.register(
  "TestTokenResponse",
  z
    .object({
      userId: z.string().openapi({
        description: "Clerk user ID",
        example: "user_2abc123def456",
      }),
      email: z.string().email().openapi({
        description: "User email",
        example: "test@example.com",
      }),
      sessionId: z.string().openapi({
        description: "Clerk session ID",
        example: "sess_2xyz789abc123",
      }),
      token: z.string().openapi({
        description: "JWT token for authentication",
        example:
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzJhYmMxMjNkZWY0NTYifQ...",
      }),
      warning: z.string().openapi({
        example: "This endpoint should be removed in production",
      }),
      instructions: z.string().openapi({
        example:
          "Copy this token and use it in Postman: Authorization: Bearer <token>",
      }),
    })
    .openapi({
      description: "Test token response data",
    }),
);

/**
 * Complete schemas for use with validation middleware
 */
export const testTokenSchema = z.object({
  body: testTokenBodySchema,
});

// Export schemas for OpenAPI documentation
export { testTokenBodySchema, testTokenResponseSchema };
