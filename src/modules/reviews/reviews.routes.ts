import { Router } from "express";
import { ReviewsController } from "./reviews.controller";

const router = Router();
const reviewsController = new ReviewsController();

// ========================================
// NESTED ROUTES IN /api/routes/:routeId/reviews
// ========================================

/**
 * @route   GET /api/routes/:routeId/reviews
 * @desc    Get all reviews for a route
 * @access  Public
 */
router.get("/:routeId/reviews", reviewsController.getRouteReviews);

/**
 * @route   POST /api/routes/:routeId/reviews
 * @desc    Create a review for a route
 * @access  Private (requiere autenticación)
 */
router.post("/:routeId/reviews", reviewsController.createReview);

// ========================================
// DIRECT ROUTES IN /api/reviews/:reviewId
// ========================================

/**
 * @route   PUT /api/reviews/:reviewId
 * @desc    Update a review (only the owner can edit)
 * @access  Private (only the user who created it)
 */
router.put("/:reviewId", reviewsController.updateReview);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Delete a review (the owner or an admin)
 * @access  Private (user owner or ADMIN)
 */
router.delete("/:reviewId", reviewsController.deleteReview);

export default router;
