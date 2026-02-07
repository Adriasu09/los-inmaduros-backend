import { prisma } from "../../database/prisma.client";
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from "../../shared/errors/custom-errors";
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
    // Verify route exists
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new NotFoundError("Route not found");
    }

    // Check if user already reviewed this route
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: userId,
        routeId: routeId,
      },
    });

    if (existingReview) {
      throw new ConflictError("You have already reviewed this route");
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
    // Find review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundError("Review not found");
    }

    // Check ownership
    if (review.userId !== userId) {
      throw new ForbiddenError("You don't have permission to edit this review");
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
    // Find review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundError("Review not found");
    }

    // Check ownership
    if (review.userId !== userId) {
      throw new ForbiddenError(
        "You don't have permission to delete this review",
      );
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });
  }
}
