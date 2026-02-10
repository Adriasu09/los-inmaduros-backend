import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../../config/openapi-registry";

// Extend Zod with OpenAPI methods
extendZodWithOpenApi(z);

/**
 * Meeting Point Schema
 */
const meetingPointSchema = z.object({
  name: z.string().openapi({
    description: "Meeting point name",
    example: "Explanada",
  }),
  location: z.string().url().optional().openapi({
    description: "Google Maps URL (undefined for 'Otro')",
    example: "https://maps.app.goo.gl/gCJfpLSoy3D454Y19",
  }),
});

/**
 * Route Pace Info Schema
 */
const routePaceInfoSchema = z.object({
  emoji: z.string().openapi({
    description: "Emoji representing the pace",
    example: "🪨",
  }),
  label: z.string().openapi({
    description: "Human-readable label",
    example: "Roca",
  }),
  description: z.string().openapi({
    description: "Detailed description of the pace level",
    example:
      "Aún no te ves seguro sobre los patines y evitas las cuestas a toda costa.",
  }),
});

/**
 * Config Response Schema
 */
const configResponseSchema = registry.register(
  "ConfigResponse",
  z
    .object({
      meetingPoints: z.array(meetingPointSchema).openapi({
        description: "Predefined meeting points for route calls",
      }),
      routePaces: z
        .record(
          z.enum([
            "ROCA",
            "CARACOL",
            "GUSANO",
            "MARIPOSA",
            "EXPERIMENTADO",
            "LOCURA_TOTAL",
            "MIAUCORNIA",
          ]),
          routePaceInfoSchema,
        )
        .openapi({
          description: "Route pace levels with emoji, label and description",
          example: {
            ROCA: {
              emoji: "🪨",
              label: "Roca",
              description: "Aún no te ves seguro sobre los patines...",
            },
            CARACOL: {
              emoji: "🐌",
              label: "Caracol",
              description: "Eres autónomo en rectas y cuesta arriba...",
            },
          },
        }),
      routeLevels: z
        .array(z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]))
        .openapi({
          description: "Available route difficulty levels",
          example: ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"],
        }),
    })
    .openapi({
      description: "Application configuration constants",
    }),
);

// Export schemas for OpenAPI documentation
export { configResponseSchema };
