import { Router } from "express";
import { ConfigController } from "./config.controller";

const router = Router();
const configController = new ConfigController();

/**
 * @route   GET /api/config
 * @desc    Get all configuration constants (meeting points, paces, levels)
 * @access  Public
 */
router.get("/", configController.getConfig);

export default router;