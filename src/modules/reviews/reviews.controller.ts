import { Request, Response, NextFunction } from "express";
import { ReviewsService } from "./reviews.service";
import { CreateReviewInput, UpdateReviewInput } from "./reviews.validation";

export class ReviewsController {
  private reviewsService: ReviewsService;

  constructor() {
    this.reviewsService = new ReviewsService();
  }

  /**
   * GET /api/routes/:routeId/reviews
   * Get all reviews for a route
   */
  getRouteReviews = async (
    req: Request<{ routeId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { routeId } = req.params;

      const reviews = await this.reviewsService.getRouteReviews(routeId);

      res.status(200).json({
        success: true,
        data: reviews,
        count: reviews.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/routes/:routeId/reviews
   * Create a review
   */
  createReview = async (
    req: Request<{ routeId: string }, {}, CreateReviewInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { routeId } = req.params;
      const validatedData = req.body;

      // TODO: Get userId from authentication token (Clerk)
      // For now, using a test ID from body or default
      const userId = (req.body as any).userId || "temp-user-id";

      const review = await this.reviewsService.createReview(
        routeId,
        userId,
        validatedData,
      );

      res.status(201).json({
        success: true,
        data: review,
        message: "Review created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/reviews/:reviewId
   * Update a review
   */
  updateReview = async (
    req: Request<{ reviewId: string }, {}, UpdateReviewInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { reviewId } = req.params;
      const validatedData = req.body;

      // TODO: Get userId from authentication token
      const userId = (req.body as any).userId || "temp-user-id";

      const review = await this.reviewsService.updateReview(
        reviewId,
        userId,
        validatedData,
      );

      res.status(200).json({
        success: true,
        data: review,
        message: "Review updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/reviews/:reviewId
   * Delete a review
   */
  deleteReview = async (
    req: Request<{ reviewId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { reviewId } = req.params;

      // TODO: Get userId from authentication token
      const userId = (req.body as any).userId || "temp-user-id";

      await this.reviewsService.deleteReview(reviewId, userId);

      res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
