import { z } from "zod";

// Schema para crear una review
export const createReviewSchema = z.object({
  rating: z
    .number()
    .int("El rating debe ser un número entero")
    .min(1, "El rating mínimo es 1")
    .max(5, "El rating máximo es 5"),
  comment: z
    .string()
    .max(500, "El comentario no puede tener más de 500 caracteres")
    .optional(),
});

// Schema para actualizar una review
export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int("El rating debe ser un número entero")
    .min(1, "El rating mínimo es 1")
    .max(5, "El rating máximo es 5")
    .optional(),
  comment: z
    .string()
    .max(500, "El comentario no puede tener más de 500 caracteres")
    .optional(),
});

// Schema para el parámetro de routeId
export const routeIdSchema = z.object({
  routeId: z.string().uuid("Debe ser un UUID válido"),
});

// Schema para el parámetro de reviewId
export const reviewIdSchema = z.object({
  reviewId: z.string().uuid("Debe ser un UUID válido"),
});

// Tipos TypeScript
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
