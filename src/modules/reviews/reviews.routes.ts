import { Router } from "express";
import { ReviewsController } from "./reviews.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import { updateReviewSchema, deleteReviewSchema } from "./reviews.validation";

const router = Router();
const reviewsController = new ReviewsController();

/**
 * Direct routes under /api/reviews
 */

/**
 * @route   PUT /api/reviews/:reviewId
 * @desc    Update a review (only the owner can edit)
 * @access  Private (only the user who created it)
 */
router.put("/:reviewId", validate(updateReviewSchema), reviewsController.updateReview);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Delete a review (the owner or an admin)
 * @access  Private (user owner or ADMIN)
 */
router.delete("/:reviewId", validate(deleteReviewSchema), reviewsController.deleteReview);

export default router;