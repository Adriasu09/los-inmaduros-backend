import { Router } from "express";
import { ReviewsController } from "./reviews.controller";

const router = Router();
const reviewsController = new ReviewsController();

// ========================================
// RUTAS ANIDADAS EN /api/routes/:routeId/reviews
// ========================================

/**
 * @route   GET /api/routes/:routeId/reviews
 * @desc    Obtener todas las reviews de una ruta
 * @access  Public
 */
router.get("/:routeId/reviews", reviewsController.getRouteReviews);

/**
 * @route   POST /api/routes/:routeId/reviews
 * @desc    Crear una review en una ruta
 * @access  Private (requiere autenticación)
 */
router.post("/:routeId/reviews", reviewsController.createReview);

// ========================================
// RUTAS DIRECTAS EN /api/reviews/:reviewId
// ========================================

/**
 * @route   PUT /api/reviews/:reviewId
 * @desc    Actualizar una review (solo el dueño puede editar)
 * @access  Private (solo el usuario que la creó)
 */
router.put("/:reviewId", reviewsController.updateReview);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Eliminar una review (el dueño o un admin)
 * @access  Private (usuario dueño o ADMIN)
 */
router.delete("/:reviewId", reviewsController.deleteReview);

export default router;
