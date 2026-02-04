import { z } from "zod";

// Enum de niveles de ruta (debe coincidir con Prisma)
export const RouteLevelEnum = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);

// Schema para el parámetro de slug
export const routeSlugSchema = z.object({
  slug: z.string().min(1, "El slug es requerido"),
});

// Tipos TypeScript generados automáticamente
export type RouteLevel = z.infer<typeof RouteLevelEnum>;
