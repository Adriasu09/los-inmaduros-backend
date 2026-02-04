import { Request, Response } from "express";
import { ReviewsService } from "./reviews.service";
import {
  createReviewSchema,
  updateReviewSchema,
  routeIdSchema,
  reviewIdSchema,
} from "./reviews.validation";
import { ZodError } from "zod";

export class ReviewsController {
  private reviewsService: ReviewsService;

  constructor() {
    this.reviewsService = new ReviewsService();
  }

  /**
   * GET /api/routes/:routeId/reviews
   * Obtener todas las reviews de una ruta
   */
  getRouteReviews = async (req: Request, res: Response) => {
    try {
      const { routeId } = routeIdSchema.parse(req.params);

      const reviews = await this.reviewsService.getRouteReviews(routeId);

      res.status(200).json({
        success: true,
        data: reviews,
        count: reviews.length,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Parámetros inválidos",
          details: error.issues,
        });
      }

      console.error("Error al obtener reviews:", error);
      res.status(500).json({
        success: false,
        error: "Error al obtener las reviews",
      });
    }
  };

  /**
   * POST /api/routes/:routeId/reviews
   * Crear una review
   */
  createReview = async (req: Request, res: Response) => {
    try {
      const { routeId } = routeIdSchema.parse(req.params);
      const validatedData = createReviewSchema.parse(req.body);

      // TODO: Obtener userId desde el token de autenticación (Clerk)
      // Por ahora usamos un ID de prueba
      const userId = req.body.userId || "temp-user-id";

      const review = await this.reviewsService.createReview(
        routeId,
        userId,
        validatedData,
      );

      res.status(201).json({
        success: true,
        data: review,
        message: "Review creada exitosamente",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Datos inválidos",
          details: error.issues,
        });
      }

      if (error instanceof Error) {
        if (error.message === "Ruta no encontrada") {
          return res.status(404).json({
            success: false,
            error: error.message,
          });
        }

        if (error.message.includes("Ya has dejado una review")) {
          return res.status(409).json({
            success: false,
            error: error.message,
          });
        }
      }

      console.error("Error al crear review:", error);
      res.status(500).json({
        success: false,
        error: "Error al crear la review",
      });
    }
  };

  /**
   * PUT /api/reviews/:reviewId
   * Actualizar una review
   */
  updateReview = async (req: Request, res: Response) => {
    try {
      const { reviewId } = reviewIdSchema.parse(req.params);
      const validatedData = updateReviewSchema.parse(req.body);

      // TODO: Obtener userId desde el token de autenticación
      const userId = req.body.userId || "temp-user-id";

      const review = await this.reviewsService.updateReview(
        reviewId,
        userId,
        validatedData,
      );

      res.status(200).json({
        success: true,
        data: review,
        message: "Review actualizada exitosamente",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Datos inválidos",
          details: error.issues,
        });
      }

      if (error instanceof Error) {
        if (error.message === "Review no encontrada") {
          return res.status(404).json({
            success: false,
            error: error.message,
          });
        }

        if (error.message.includes("No tienes permiso")) {
          return res.status(403).json({
            success: false,
            error: error.message,
          });
        }
      }

      console.error("Error al actualizar review:", error);
      res.status(500).json({
        success: false,
        error: "Error al actualizar la review",
      });
    }
  };

  /**
   * DELETE /api/reviews/:reviewId
   * Eliminar una review
   */
  deleteReview = async (req: Request, res: Response) => {
    try {
      const { reviewId } = reviewIdSchema.parse(req.params);

      // TODO: Obtener userId desde el token de autenticación
      const userId = req.body.userId || "temp-user-id";

      await this.reviewsService.deleteReview(reviewId, userId);

      res.status(200).json({
        success: true,
        message: "Review eliminada exitosamente",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Parámetros inválidos",
          details: error.issues,
        });
      }

      if (error instanceof Error) {
        if (error.message === "Review no encontrada") {
          return res.status(404).json({
            success: false,
            error: error.message,
          });
        }

        if (error.message.includes("No tienes permiso")) {
          return res.status(403).json({
            success: false,
            error: error.message,
          });
        }
      }

      console.error("Error al eliminar review:", error);
      res.status(500).json({
        success: false,
        error: "Error al eliminar la review",
      });
    }
  };
}
