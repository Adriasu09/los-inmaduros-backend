import { Router } from "express";
import { ReviewsController } from "./reviews.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import {
  getRouteReviewsSchema,
  createReviewSchema,
} from "./reviews.validation";
import { requireAuth } from "../../shared/middlewares/auth.middleware";

const router = Router({ mergeParams: true });
const reviewsController = new ReviewsController();

/**
 * Nested routes under /api/routes/:routeId/reviews
 */

/**
 * @route   GET /api/routes/:routeId/reviews
 * @desc    Get all reviews for a specific route
 * @access  Public
 */
router.get(
  "/",
  validate(getRouteReviewsSchema),
  reviewsController.getRouteReviews,
);

/**
 * @route   POST /api/routes/:routeId/reviews
 * @desc    Create a review for a specific route
 * @access  Private (requires authentication)
 */
router.post(
  "/",
  requireAuth,
  validate(createReviewSchema),
  reviewsController.createReview,
);

export default router;
