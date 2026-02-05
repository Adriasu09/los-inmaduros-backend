import { z } from "zod";

export const RouteLevelEnum = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);

export const routeSlugSchema = z.object({
  slug: z.string().min(1, "El slug es requerido"),
});

export type RouteLevel = z.infer<typeof RouteLevelEnum>;
