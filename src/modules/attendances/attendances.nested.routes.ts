import { Router } from "express";
import { AttendancesController } from "./attendances.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import {
  confirmAttendanceSchema,
  cancelAttendanceSchema,
  getRouteCallAttendancesSchema,
} from "./attendances.validation";

const router = Router({ mergeParams: true });
const attendancesController = new AttendancesController();

/**
 * @route   POST /api/route-calls/:routeCallId/attendances
 * @desc    Confirm attendance to a route call
 * @access  Private (requires authentication)
 */
router.post(
  "/",
  validate(confirmAttendanceSchema),
  attendancesController.confirmAttendance,
);

/**
 * @route   DELETE /api/route-calls/:routeCallId/attendances
 * @desc    Cancel attendance to a route call
 * @access  Private (only own attendance)
 */
router.delete(
  "/",
  validate(cancelAttendanceSchema),
  attendancesController.cancelAttendance,
);

/**
 * @route   GET /api/route-calls/:routeCallId/attendances
 * @desc    Get all attendances for a route call
 * @access  Public (anyone can see who's attending)
 */
router.get(
  "/",
  validate(getRouteCallAttendancesSchema),
  attendancesController.getRouteCallAttendances,
);

export default router;
