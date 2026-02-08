import { Router } from "express";
import { AttendancesController } from "./attendances.controller";
import { requireAuth } from "../../shared/middlewares/auth.middleware";

const router = Router();
const attendancesController = new AttendancesController();

/**
 * @route   GET /api/attendances/my-attendances
 * @desc    Get all attendances for the authenticated user
 * @access  Private (requires authentication)
 */
router.get(
  "/my-attendances",
  requireAuth,
  attendancesController.getUserAttendances,
);

export default router;
