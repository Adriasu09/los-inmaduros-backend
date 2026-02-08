import { prisma } from "../../database/prisma.client";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../shared/errors/custom-errors";
import {
  CreateRouteCallInput,
  UpdateRouteCallInput,
} from "./route-calls.validation";

// Default image for custom routes without image
const DEFAULT_ROUTE_CALL_IMAGE =
  "https://images.unsplash.com/photo-1564783436897-4c044a6d9c56?w=800";

export class RouteCallsService {
  /**
   * Create a new route call with meeting points
   */
  async createRouteCall(organizerId: string, data: CreateRouteCallInput) {
    let title: string;
    let image: string;

    // If routeId is provided, get route name and image
    if (data.routeId) {
      const route = await prisma.route.findUnique({
        where: { id: data.routeId },
        select: { id: true, name: true, image: true },
      });

      if (!route) {
        throw new NotFoundError("Route not found");
      }

      // Use route's name as title (ignore provided title for predefined routes)
      title = route.name;
      // Use route's image as default (can be overridden by data.image)
      image = data.image || route.image;
    } else {
      // Custom route: title is required
      if (!data.title) {
        throw new BadRequestError("Title is required for custom routes");
      }
      title = data.title;
      // Use provided image or default placeholder
      image = data.image || DEFAULT_ROUTE_CALL_IMAGE;
    }

    // Create route call with meeting points
    const routeCall = await prisma.routeCall.create({
      data: {
        routeId: data.routeId || null,
        organizerId,
        title: title,
        description: data.description || null,
        image: image,
        dateRoute: new Date(data.dateRoute),
        pace: data.pace,
        status: "SCHEDULED",
        meetingPoints: {
          create: data.meetingPoints.map((point) => ({
            type: point.type,
            name: point.name,
            customName: point.customName || null,
            location: point.location || null,
            time: point.time ? new Date(point.time) : null,
          })),
        },
      },
      include: {
        route: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            approximateDistance: true,
            level: true,
          },
        },
        organizer: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        meetingPoints: {
          orderBy: {
            type: "asc",
          },
        },
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    });

    return routeCall;
  }

  /**
   * Get all route calls with optional filters
   */
  async getRouteCalls(filters?: {
    status?: string;
    organizerId?: string;
    upcoming?: string;
    routeId?: string;
  }) {
    const where: any = {};

    // Filter by status
    if (filters?.status) {
      where.status = filters.status;
    }

    // Filter by organizer
    if (filters?.organizerId) {
      where.organizerId = filters.organizerId;
    }

    // Filter by route
    if (filters?.routeId) {
      where.routeId = filters.routeId;
    }

    // Filter by upcoming/past
    if (filters?.upcoming === "true") {
      where.dateRoute = {
        gte: new Date(), // Greater than or equal to now
      };
      where.status = {
        in: ["SCHEDULED", "ONGOING"],
      };
    } else if (filters?.upcoming === "false") {
      where.OR = [
        {
          dateRoute: {
            lt: new Date(), // Less than now
          },
        },
        {
          status: {
            in: ["COMPLETED", "CANCELLED"],
          },
        },
      ];
    }

    const routeCalls = await prisma.routeCall.findMany({
      where,
      include: {
        route: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            approximateDistance: true,
            level: true,
          },
        },
        organizer: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        meetingPoints: {
          orderBy: {
            type: "asc",
          },
        },
        _count: {
          select: {
            attendances: true,
          },
        },
      },
      orderBy: {
        dateRoute: filters?.upcoming === "false" ? "desc" : "asc",
      },
    });

    return routeCalls;
  }

  /**
   * Get a single route call by ID
   */
  async getRouteCallById(id: string) {
    const routeCall = await prisma.routeCall.findUnique({
      where: { id },
      include: {
        route: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            approximateDistance: true,
            description: true,
            level: true,
          },
        },
        organizer: {
          select: {
            id: true,
            name: true,
            lastName: true,
            imageUrl: true,
          },
        },
        meetingPoints: {
          orderBy: {
            type: "asc",
          },
        },
        attendances: {
          where: {
            status: "CONFIRMED",
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
        },
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    });

    if (!routeCall) {
      throw new NotFoundError("Route call not found");
    }

    return routeCall;
  }

  /**
   * Update a route call (only organizer)
   */
  async updateRouteCall(
    id: string,
    userId: string,
    data: UpdateRouteCallInput,
  ) {
    const routeCall = await prisma.routeCall.findUnique({
      where: { id },
    });

    if (!routeCall) {
      throw new NotFoundError("Route call not found");
    }

    // Check permissions: only organizer can update
    if (routeCall.organizerId !== userId) {
      throw new ForbiddenError("Only the organizer can update this route call");
    }

    const updated = await prisma.routeCall.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.dateRoute && { dateRoute: new Date(data.dateRoute) }),
        ...(data.pace && { pace: data.pace }),
      },
      include: {
        route: true,
        organizer: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        meetingPoints: {
          orderBy: {
            type: "asc",
          },
        },
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    });

    return updated;
  }

  /**
   * Cancel a route call (organizer or admin)
   * Changes status to CANCELLED but keeps it in database
   */
  async cancelRouteCall(id: string, userId: string, userRole: string) {
    const routeCall = await prisma.routeCall.findUnique({
      where: { id },
    });

    if (!routeCall) {
      throw new NotFoundError("Route call not found");
    }

    // Check permissions: organizer or admin
    if (routeCall.organizerId !== userId && userRole !== "ADMIN") {
      throw new ForbiddenError(
        "Only the organizer or an admin can cancel this route call",
      );
    }

    // Cannot cancel if already completed or cancelled
    if (routeCall.status === "COMPLETED") {
      throw new BadRequestError("Cannot cancel a completed route call");
    }

    if (routeCall.status === "CANCELLED") {
      throw new BadRequestError("Route call is already cancelled");
    }

    const cancelled = await prisma.routeCall.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
      include: {
        route: true,
        organizer: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        meetingPoints: true,
      },
    });

    return cancelled;
  }

  /**
   * Delete a route call permanently (organizer or admin)
   * Only allowed if no attendances or for testing purposes
   */
  async deleteRouteCall(id: string, userId: string, userRole: string) {
    const routeCall = await prisma.routeCall.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    });

    if (!routeCall) {
      throw new NotFoundError("Route call not found");
    }

    // Check permissions: organizer or admin
    if (routeCall.organizerId !== userId && userRole !== "ADMIN") {
      throw new ForbiddenError(
        "Only the organizer or an admin can delete this route call",
      );
    }

    // Check if there are attendances
    if (routeCall._count.attendances > 0) {
      throw new BadRequestError(
        "Cannot delete a route call with attendances. Cancel it instead.",
      );
    }

    // Delete route call (meeting points will be deleted automatically due to cascade)
    await prisma.routeCall.delete({
      where: { id },
    });
  }
}
