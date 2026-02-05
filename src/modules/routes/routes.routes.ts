import { Router } from "express";
import { RoutesController } from "./routes.controller";

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
router.get("/:slug", routesController.getRouteBySlug);

export default router;
