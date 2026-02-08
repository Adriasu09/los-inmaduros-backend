import { Router } from "express";
import { AttendancesController } from "./attendances.controller";

const router = Router();
const attendancesController = new AttendancesController();

/**
 * @route   GET /api/attendances/my-attendances
 * @desc    Get all attendances for the authenticated user
 * @access  Private (requires authentication)
 */
router.get("/my-attendances", attendancesController.getUserAttendances);

export default router;
