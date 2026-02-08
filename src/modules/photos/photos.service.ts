import { prisma } from "../../database/prisma.client";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../shared/errors/custom-errors";
import { UploadPhotoInput, UpdateCoverPhotoInput } from "./photos.validation";

export class PhotosService {
  /**
   * Upload a photo with context-based permissions
   */
  async uploadPhoto(userId: string, data: UploadPhotoInput) {
    // Validate based on context
    if (data.context === "ROUTE_GALLERY") {
      // Verify route exists
      const route = await prisma.route.findUnique({
        where: { id: data.routeId },
        select: { id: true },
      });

      if (!route) {
        throw new NotFoundError("Route not found");
      }
    }

    if (
      data.context === "ROUTE_CALL_COVER" ||
      data.context === "ROUTE_CALL_GALLERY"
    ) {
      // Verify route call exists
      const routeCall = await prisma.routeCall.findUnique({
        where: { id: data.routeCallId },
        select: { id: true, organizerId: true, status: true },
      });

      if (!routeCall) {
        throw new NotFoundError("Route call not found");
      }

      // ROUTE_CALL_COVER: Only organizer can upload
      if (data.context === "ROUTE_CALL_COVER") {
        if (routeCall.organizerId !== userId) {
          throw new ForbiddenError(
            "Only the organizer can upload a cover photo",
          );
        }
      }

      // ROUTE_CALL_GALLERY: Only confirmed attendees can upload
      if (data.context === "ROUTE_CALL_GALLERY") {
        const attendance = await prisma.attendance.findUnique({
          where: {
            routeCallId_userId: {
              routeCallId: data.routeCallId!,
              userId,
            },
          },
        });

        if (!attendance || attendance.status !== "CONFIRMED") {
          throw new ForbiddenError(
            "Only confirmed attendees can upload photos to this route call gallery",
          );
        }
      }
    }

    // Create photo
    const photo = await prisma.photo.create({
      data: {
        context: data.context,
        routeId: data.routeId || null,
        routeCallId: data.routeCallId || null,
        userId,
        imageUrl: data.imageUrl,
        caption: data.caption || null,
        status: "ACTIVE", // Post-moderation: publish immediately
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        route: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        routeCall: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // TODO: Send notification to admins for review

    return photo;
  }

  /**
   * Update route call cover photo
   */
  async updateCoverPhoto(
    userId: string,
    routeCallId: string,
    data: UpdateCoverPhotoInput,
  ) {
    // Verify route call exists and user is organizer
    const routeCall = await prisma.routeCall.findUnique({
      where: { id: routeCallId },
      select: { id: true, organizerId: true },
    });

    if (!routeCall) {
      throw new NotFoundError("Route call not found");
    }

    if (routeCall.organizerId !== userId) {
      throw new ForbiddenError("Only the organizer can update the cover photo");
    }

    // Check if there's already a cover photo
    const existingCover = await prisma.photo.findFirst({
      where: {
        routeCallId,
        context: "ROUTE_CALL_COVER",
      },
    });

    if (existingCover) {
      // Update existing cover
      const updated = await prisma.photo.update({
        where: { id: existingCover.id },
        data: {
          imageUrl: data.imageUrl,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      });

      return updated;
    } else {
      // Create new cover
      const newCover = await prisma.photo.create({
        data: {
          context: "ROUTE_CALL_COVER",
          routeCallId,
          userId,
          imageUrl: data.imageUrl,
          status: "ACTIVE",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      });

      return newCover;
    }
  }

  /**
   * Get public gallery (only ACTIVE photos)
   */
  async getPhotos(filters?: {
    context?: string;
    routeId?: string;
    routeCallId?: string;
    status?: string;
  }) {
    const where: any = {};

    // By default, only show ACTIVE photos (public gallery)
    where.status = filters?.status || "ACTIVE";

    if (filters?.context) {
      where.context = filters.context;
    }

    if (filters?.routeId) {
      where.routeId = filters.routeId;
    }

    if (filters?.routeCallId) {
      where.routeCallId = filters.routeCallId;
    }

    const photos = await prisma.photo.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        route: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        routeCall: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return photos;
  }

  /**
   * Get route gallery by slug
   */
  async getRouteGallery(slug: string) {
    const route = await prisma.route.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!route) {
      throw new NotFoundError("Route not found");
    }

    const photos = await prisma.photo.findMany({
      where: {
        routeId: route.id,
        context: "ROUTE_GALLERY",
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      route,
      photos,
      count: photos.length,
    };
  }

  /**
   * Get route call gallery
   */
  async getRouteCallGallery(routeCallId: string) {
    const routeCall = await prisma.routeCall.findUnique({
      where: { id: routeCallId },
      select: { id: true, title: true },
    });

    if (!routeCall) {
      throw new NotFoundError("Route call not found");
    }

    const photos = await prisma.photo.findMany({
      where: {
        routeCallId,
        context: "ROUTE_CALL_GALLERY",
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      routeCall,
      photos,
      count: photos.length,
    };
  }

  /**
   * Get user's own photos (all statuses)
   */
  async getUserPhotos(userId: string) {
    const photos = await prisma.photo.findMany({
      where: {
        userId,
        status: {
          not: "DELETED",
        },
      },
      include: {
        route: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        routeCall: {
          select: {
            id: true,
            title: true,
          },
        },
        moderator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return photos;
  }

  /**
   * Get pending photos for admin review
   */
  async getPendingPhotos() {
    // In post-moderation, we show all ACTIVE photos that haven't been reviewed
    const photos = await prisma.photo.findMany({
      where: {
        status: "ACTIVE",
        moderatedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        route: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        routeCall: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Oldest first
      },
    });

    return photos;
  }

  /**
   * Reject a photo (admin only)
   */
  async rejectPhoto(
    adminId: string,
    photoId: string,
    moderationNotes?: string,
  ) {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new NotFoundError("Photo not found");
    }

    if (photo.status === "DELETED") {
      throw new BadRequestError("Photo is already deleted");
    }

    const rejected = await prisma.photo.update({
      where: { id: photoId },
      data: {
        status: "REJECTED",
        moderatedBy: adminId,
        moderatedAt: new Date(),
        moderationNotes: moderationNotes || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // TODO: Send notification to user that photo was rejected

    return rejected;
  }

  /**
   * Approve a photo explicitly (admin only, optional)
   */
  async approvePhoto(adminId: string, photoId: string) {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new NotFoundError("Photo not found");
    }

    const approved = await prisma.photo.update({
      where: { id: photoId },
      data: {
        moderatedBy: adminId,
        moderatedAt: new Date(),
      },
    });

    return approved;
  }

  /**
   * Delete a photo (owner or admin)
   */
  async deletePhoto(userId: string, userRole: string, photoId: string) {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      select: { id: true, userId: true, status: true },
    });

    if (!photo) {
      throw new NotFoundError("Photo not found");
    }

    // Check permissions: owner or admin
    if (photo.userId !== userId && userRole !== "ADMIN") {
      throw new ForbiddenError("You can only delete your own photos");
    }

    // Soft delete
    await prisma.photo.update({
      where: { id: photoId },
      data: {
        status: "DELETED",
      },
    });
  }
}
