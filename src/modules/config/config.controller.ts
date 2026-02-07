import { Request, Response } from "express";
import { PREDEFINED_MEETING_POINTS } from "../../shared/constants/meeting-points.constants";
import { ROUTE_PACE_INFO } from "../../shared/constants/route-pace.constants";

export class ConfigController {
  /**
   * GET /api/config
   * Get all application configuration constants
   */
  getConfig = async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        meetingPoints: PREDEFINED_MEETING_POINTS,
        routePaces: ROUTE_PACE_INFO,
        routeLevels: ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"],
      },
    });
  };
}