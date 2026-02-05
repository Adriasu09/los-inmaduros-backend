import { prisma } from "../../database/prisma.client";
import { CreateReviewInput, UpdateReviewInput } from "./reviews.validation";

export class ReviewsService {
  /**
   * Get all reviews for a route
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
   * Create a review
   */
  async createReview(routeId: string, userId: string, data: CreateReviewInput) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new Error("Ruta no encontrada");
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        userId: userId,
        routeId: routeId,
      },
    });

    if (existingReview) {
      throw new Error("Ya has dejado una review en esta ruta");
    }

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
   * Update a review
   */
  async updateReview(
    reviewId: string,
    userId: string,
    data: UpdateReviewInput,
  ) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review no encontrada");
    }

    if (review.userId !== userId) {
      throw new Error("No tienes permiso para editar esta review");
    }

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
   * Delete a review
   */
  async deleteReview(reviewId: string, userId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review no encontrada");
    }

    if (review.userId !== userId) {
      throw new Error("No tienes permiso para eliminar esta review");
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });
  }
}
