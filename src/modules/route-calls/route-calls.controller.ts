import { Request, Response, NextFunction } from "express";
import { RouteCallsService } from "./route-calls.service";
import {
  CreateRouteCallInput,
  UpdateRouteCallInput,
} from "./route-calls.validation";

export class RouteCallsController {
  private routeCallsService: RouteCallsService;

  constructor() {
    this.routeCallsService = new RouteCallsService();
  }

  /**
   * POST /api/route-calls
   * Create a new route call
   */
  createRouteCall = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = req.body as CreateRouteCallInput;

      const userId = req.auth!.userId;

      const routeCall = await this.routeCallsService.createRouteCall(
        userId,
        validatedData,
      );

      res.status(201).json({
        success: true,
        data: routeCall,
        message: "Route call created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/route-calls
   * Get all route calls with optional filters
   */
  getRouteCalls = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = req.query as {
        status?: string;
        organizerId?: string;
        upcoming?: string;
        routeId?: string;
      };

      const routeCalls = await this.routeCallsService.getRouteCalls(filters);

      res.status(200).json({
        success: true,
        data: routeCalls,
        count: routeCalls.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/route-calls/:id
   * Get a single route call by ID
   */
  getRouteCallById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id as string;

      const routeCall = await this.routeCallsService.getRouteCallById(id);

      res.status(200).json({
        success: true,
        data: routeCall,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/route-calls/:id
   * Update a route call (only organizer)
   */
  updateRouteCall = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const validatedData = req.body as UpdateRouteCallInput;

      const userId = req.auth!.userId;

      const routeCall = await this.routeCallsService.updateRouteCall(
        id,
        userId,
        validatedData,
      );

      res.status(200).json({
        success: true,
        data: routeCall,
        message: "Route call updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/route-calls/:id/cancel
   * Cancel a route call (organizer or admin)
   */
  cancelRouteCall = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      const userId = req.auth!.userId;
      const userRole = req.auth!.role;

      const routeCall = await this.routeCallsService.cancelRouteCall(
        id,
        userId,
        userRole,
      );

      res.status(200).json({
        success: true,
        data: routeCall,
        message: "Route call cancelled successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/route-calls/:id
   * Delete a route call permanently (organizer or admin)
   */
  deleteRouteCall = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      const userId = req.auth!.userId;
      const userRole = req.auth!.role;

      await this.routeCallsService.deleteRouteCall(id, userId, userRole);

      res.status(200).json({
        success: true,
        message: "Route call deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
