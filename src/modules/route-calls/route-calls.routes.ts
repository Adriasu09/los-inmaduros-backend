import { Router } from "express";
import { RouteCallsController } from "./route-calls.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import {
  createRouteCallSchema,
  getRouteCallsSchema,
  getRouteCallByIdSchema,
  updateRouteCallSchema,
  cancelRouteCallSchema,
  deleteRouteCallSchema,
} from "./route-calls.validation";
import {
  requireAuth,
  requireAdmin,
} from "../../shared/middlewares/auth.middleware";

const router = Router();
const routeCallsController = new RouteCallsController();

/**
 * @route   POST /api/route-calls
 * @desc    Create a new route call
 * @access  Private (requires authentication)
 */
router.post(
  "/",
  requireAuth,
  validate(createRouteCallSchema),
  routeCallsController.createRouteCall,
);

/**
 * @route   GET /api/route-calls
 * @desc    Get all route calls with optional filters
 * @access  Public
 */
router.get(
  "/",
  validate(getRouteCallsSchema),
  routeCallsController.getRouteCalls,
);

/**
 * @route   GET /api/route-calls/:id
 * @desc    Get a single route call by ID
 * @access  Public
 */
router.get(
  "/:id",
  validate(getRouteCallByIdSchema),
  routeCallsController.getRouteCallById,
);

/**
 * @route   PUT /api/route-calls/:id
 * @desc    Update a route call (only organizer)
 * @access  Private (only organizer)
 */
router.put(
  "/:id",
  requireAuth,
  validate(updateRouteCallSchema),
  routeCallsController.updateRouteCall,
);

/**
 * @route   PATCH /api/route-calls/:id/cancel
 * @desc    Cancel a route call (organizer or admin)
 * @access  Private (organizer or admin)
 */
router.patch(
  "/:id/cancel",
  requireAuth,
  validate(cancelRouteCallSchema),
  routeCallsController.cancelRouteCall,
);

/**
 * @route   DELETE /api/route-calls/:id
 * @desc    Delete a route call permanently (organizer or admin)
 * @access  Private (organizer or admin)
 */
router.delete(
  "/:id",
  requireAuth,
  validate(deleteRouteCallSchema),
  routeCallsController.deleteRouteCall,
);

export default router;
