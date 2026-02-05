import { Request, Response, NextFunction } from "express";
import { ReviewsService } from "./reviews.service";
import {
  createReviewSchema,
  updateReviewSchema,
  routeIdSchema,
  reviewIdSchema,
} from "./reviews.validation";

export class ReviewsController {
  private reviewsService: ReviewsService;

  constructor() {
    this.reviewsService = new ReviewsService();
  }

  /**
   * GET /api/routes/:routeId/reviews
   * Get all reviews for a route
   */
  getRouteReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { routeId } = routeIdSchema.parse(req.params);

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
  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { routeId } = routeIdSchema.parse(req.params);
      const validatedData = createReviewSchema.parse(req.body);

      // TODO: Get userId from authentication token (Clerk)
      // For now, using a test ID
      const userId = req.body.userId || "temp-user-id";

      const review = await this.reviewsService.createReview(
        routeId,
        userId,
        validatedData
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
  updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reviewId } = reviewIdSchema.parse(req.params);
      const validatedData = updateReviewSchema.parse(req.body);

      // TODO: Get userId from authentication token
      const userId = req.body.userId || "temp-user-id";

      const review = await this.reviewsService.updateReview(
        reviewId,
        userId,
        validatedData
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
  deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reviewId } = reviewIdSchema.parse(req.params);

      // TODO: Get userId from authentication token
      const userId = req.body.userId || "temp-user-id";

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