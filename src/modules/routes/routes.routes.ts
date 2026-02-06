import { Router } from "express";
import { RoutesController } from "./routes.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import { getRouteBySlugSchema } from "./routes.validation";

const router = Router();
const routesController = new RoutesController();

/**
 * @route   GET /api/routes
 * @desc    Get all routes
 * @access  Public
 */
router.get("/", routesController.getAllRoutes);

/**
 * @route   GET /api/routes/:slug
 * @desc    Get a route by slug
 * @access  Public
 */
router.get("/:slug", validate(getRouteBySlugSchema), routesController.getRouteBySlug);

export default router;