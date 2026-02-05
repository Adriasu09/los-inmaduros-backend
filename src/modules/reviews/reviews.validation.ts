import { z } from "zod";

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

export const routeIdSchema = z.object({
  routeId: z.string().uuid("Debe ser un UUID válido"),
});

export const reviewIdSchema = z.object({
  reviewId: z.string().uuid("Debe ser un UUID válido"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
