import { Request, Response, NextFunction } from "express";
import { AttendancesService } from "./attendances.service";

export class AttendancesController {
  private attendancesService: AttendancesService;

  constructor() {
    this.attendancesService = new AttendancesService();
  }

  /**
   * POST /api/route-calls/:routeCallId/attendances
   * Confirm attendance to a route call
   */
  confirmAttendance = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const routeCallId = req.params.routeCallId as string;

      const userId = req.auth!.userId;

      const attendance = await this.attendancesService.confirmAttendance(
        userId,
        routeCallId,
      );

      res.status(201).json({
        success: true,
        data: attendance,
        message: "Attendance confirmed successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/route-calls/:routeCallId/attendances
   * Cancel attendance to a route call
   */
  cancelAttendance = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const routeCallId = req.params.routeCallId as string;

      const userId = req.auth!.userId;

      const attendance = await this.attendancesService.cancelAttendance(
        userId,
        routeCallId,
      );

      res.status(200).json({
        success: true,
        data: attendance,
        message: "Attendance cancelled successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/route-calls/:routeCallId/attendances
   * Get all attendances for a route call
   */
  getRouteCallAttendances = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const routeCallId = req.params.routeCallId as string;

      const attendances =
        await this.attendancesService.getRouteCallAttendances(routeCallId);

      res.status(200).json({
        success: true,
        data: attendances,
        count: attendances.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/attendances/my-attendances
   * Get all attendances for the authenticated user
   */
  getUserAttendances = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.auth!.userId;

      const attendances =
        await this.attendancesService.getUserAttendances(userId);

      res.status(200).json({
        success: true,
        data: attendances,
        count: attendances.length,
      });
    } catch (error) {
      next(error);
    }
  };
}
