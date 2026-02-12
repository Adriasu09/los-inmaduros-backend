import { Request, Response, NextFunction } from "express";
import { PhotosService } from "./photos.service";
import { BadRequestError } from "../../shared/errors/custom-errors";

export class PhotosController {
  private photosService: PhotosService;

  constructor() {
    this.photosService = new PhotosService();
  }

  /**
   * POST /api/photos
   * Upload a photo
   */
  uploadPhoto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        throw new BadRequestError("No file uploaded");
      }

      const userId = req.auth!.userId;
      const validatedData = req.body;

      const photo = await this.photosService.uploadPhoto(
        userId,
        req.file,
        validatedData,
      );

      res.status(201).json({
        success: true,
        data: photo,
        message: "Photo uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/route-calls/:id/cover-photo
   * Update route call cover photo
   */
  updateCoverPhoto = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        throw new BadRequestError("No file uploaded");
      }

      const routeCallId = req.params.id as string;
      const userId = req.auth!.userId;

      const photo = await this.photosService.updateCoverPhoto(
        userId,
        routeCallId,
        req.file,
      );

      res.status(200).json({
        success: true,
        data: photo,
        message: "Cover photo updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/photos
   * Get public gallery (only ACTIVE photos by default)
   */
  getPhotos = async (req: Request, res: Response) => {
    const filters = req.query as {
      context?: string;
      routeId?: string;
      routeCallId?: string;
      status?: string;
      page?: number;
      limit?: number;
    };

    const result = await this.photosService.getPhotos(filters);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  };

  /**
   * GET /api/routes/:slug/gallery
   * Get route gallery
   */
  getRouteGallery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params.slug as string;

      const result = await this.photosService.getRouteGallery(slug);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/route-calls/:id/gallery
   * Get route call gallery
   */
  getRouteCallGallery = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id as string;

      const result = await this.photosService.getRouteCallGallery(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/photos/my-photos
   * Get user's own photos (all statuses)
   */
  getUserPhotos = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth!.userId;

      const photos = await this.photosService.getUserPhotos(userId);

      res.status(200).json({
        success: true,
        data: photos,
        count: photos.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/photos/pending-review
   * Get pending photos for admin review
   */
  getPendingPhotos = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // TODO: Verify user is ADMIN

      const photos = await this.photosService.getPendingPhotos();

      res.status(200).json({
        success: true,
        data: photos,
        count: photos.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/photos/:id/reject
   * Reject a photo (admin only)
   */
  rejectPhoto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const photoId = req.params.id as string;
      const { moderationNotes } = req.body;

      const adminId = req.auth!.userId;

      const photo = await this.photosService.rejectPhoto(
        adminId,
        photoId,
        moderationNotes,
      );

      res.status(200).json({
        success: true,
        data: photo,
        message: "Photo rejected successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/photos/:id/approve
   * Approve a photo explicitly (admin only)
   */
  approvePhoto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const photoId = req.params.id as string;
      const adminId = req.auth!.userId;

      const photo = await this.photosService.approvePhoto(adminId, photoId);

      res.status(200).json({
        success: true,
        data: photo,
        message: "Photo approved successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/photos/:id
   * Delete a photo (owner or admin)
   */
  deletePhoto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const photoId = req.params.id as string;

      const userId = req.auth!.userId;
      const userRole = req.auth!.role;

      await this.photosService.deletePhoto(userId, userRole, photoId);

      res.status(200).json({
        success: true,
        message: "Photo deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
