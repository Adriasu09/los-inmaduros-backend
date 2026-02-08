import { Router } from "express";
import { PhotosController } from "./photos.controller";
import { validate } from "../../shared/middlewares/validation.middleware";
import {
  uploadPhotoSchema,
  getPhotosSchema,
  getRouteGallerySchema,
  getRouteCallGallerySchema,
  updateCoverPhotoSchema,
  deletePhotoSchema,
  rejectPhotoSchema,
  approvePhotoSchema,
} from "./photos.validation";
import {
  requireAuth,
  requireAdmin,
} from "../../shared/middlewares/auth.middleware";

const router = Router();
const photosController = new PhotosController();

/**
 * @route   POST /api/photos
 * @desc    Upload a photo
 * @access  Private (context-based permissions)
 */
router.post(
  "/",
  requireAuth,
  validate(uploadPhotoSchema),
  photosController.uploadPhoto,
);

/**
 * @route   GET /api/photos
 * @desc    Get public gallery (only ACTIVE photos by default)
 * @access  Public
 */
router.get("/", validate(getPhotosSchema), photosController.getPhotos);

/**
 * @route   GET /api/photos/my-photos
 * @desc    Get user's own photos (all statuses)
 * @access  Private
 */
router.get("/my-photos", requireAuth, photosController.getUserPhotos);

/**
 * @route   GET /api/photos/pending-review
 * @desc    Get pending photos for admin review
 * @access  Private (admin only)
 */
router.get(
  "/pending-review",
  requireAuth,
  requireAdmin,
  photosController.getPendingPhotos,
);

/**
 * @route   PATCH /api/photos/:id/approve
 * @desc    Approve a photo explicitly
 * @access  Private (admin only)
 */
router.patch(
  "/:id/approve",
  requireAuth,
  requireAdmin,
  validate(approvePhotoSchema),
  photosController.approvePhoto,
);

/**
 * @route   PATCH /api/photos/:id/reject
 * @desc    Reject a photo
 * @access  Private (admin only)
 */
router.patch(
  "/:id/reject",
  requireAuth,
  requireAdmin,
  validate(rejectPhotoSchema),
  photosController.rejectPhoto,
);

/**
 * @route   DELETE /api/photos/:id
 * @desc    Delete a photo (owner or admin)
 * @access  Private
 */
router.delete(
  "/:id",
  requireAuth,
  validate(deletePhotoSchema),
  photosController.deletePhoto,
);

/**
 * @route   GET /api/routes/:slug/gallery
 * @desc    Get route gallery
 * @access  Public
 */
router.get(
  "/routes/:slug/gallery",
  validate(getRouteGallerySchema),
  photosController.getRouteGallery,
);

/**
 * @route   GET /api/route-calls/:id/gallery
 * @desc    Get route call gallery
 * @access  Public
 */
router.get(
  "/route-calls/:id/gallery",
  validate(getRouteCallGallerySchema),
  photosController.getRouteCallGallery,
);

/**
 * @route   PATCH /api/route-calls/:id/cover-photo
 * @desc    Update route call cover photo
 * @access  Private (organizer only)
 */
router.patch(
  "/route-calls/:id/cover-photo",
  requireAuth,
  validate(updateCoverPhotoSchema),
  photosController.updateCoverPhoto,
);

export default router;
