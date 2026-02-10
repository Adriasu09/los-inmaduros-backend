import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

// Create global registry
export const registry = new OpenAPIRegistry();

// Register Bearer Auth security scheme
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description:
    "JWT token obtenido desde Clerk. Usa el endpoint /api/auth/test-token para obtener uno de prueba.",
});

/**
 * Generate OpenAPI document from registry
 */
export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Los Inmaduros Rollers Madrid API",
      version: "1.0.0",
      description:
        "API Backend for the Los Inmaduros Rollers Madrid skating community. Manage routes, events, attendance, reviews, favorites, and photo galleries.",
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints (DEVELOPMENT ONLY)",
      },
      {
        name: "Routes",
        description: "Predefined routes management",
      },
      {
        name: "Reviews",
        description: "Route reviews management",
      },
      {
        name: "Favorites",
        description: "User favorites management",
      },
      {
        name: "Route Calls",
        description: "Route call/convocatoria management",
      },
      {
        name: "Attendances",
        description: "Route call attendances management",
      },
      {
        name: "Photos",
        description: "Photo gallery management with moderation",
      },
      {
        name: "Config",
        description: "Configuration and constants",
      },
    ],
  });
}
