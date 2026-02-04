import { prisma } from "../../database/prisma.client";
import { CreateReviewInput, UpdateReviewInput } from "./reviews.validation";

export class ReviewsService {
  /**
   * Obtener todas las reviews de una ruta
   */
  async getRouteReviews(routeId: string) {
    return await prisma.review.findMany({
      where: { routeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Crear una review
   */
  async createReview(routeId: string, userId: string, data: CreateReviewInput) {
    // Verificar que la ruta existe
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new Error("Ruta no encontrada");
    }

    // Verificar que el usuario no tenga ya una review en esta ruta
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: userId,
        routeId: routeId,
      },
    });

    if (existingReview) {
      throw new Error("Ya has dejado una review en esta ruta");
    }

    // Crear la review
    return await prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment ?? null,
        user: {
          connect: { id: userId },
        },
        route: {
          connect: { id: routeId },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  /**
   * Actualizar una review
   */
  async updateReview(
    reviewId: string,
    userId: string,
    data: UpdateReviewInput,
  ) {
    // Verificar que la review existe
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review no encontrada");
    }

    // Verificar que el usuario es el dueño
    if (review.userId !== userId) {
      throw new Error("No tienes permiso para editar esta review");
    }

    // Actualizar
    return await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(data.rating && { rating: data.rating }),
        ...(data.comment !== undefined && { comment: data.comment ?? null }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  /**
   * Eliminar una review
   */
  async deleteReview(reviewId: string, userId: string) {
    // Verificar que la review existe
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review no encontrada");
    }

    // Verificar que el usuario es el dueño
    if (review.userId !== userId) {
      throw new Error("No tienes permiso para eliminar esta review");
    }

    // Eliminar
    await prisma.review.delete({
      where: { id: reviewId },
    });
  }
}
