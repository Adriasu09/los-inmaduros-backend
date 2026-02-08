import { prisma } from "../../database/prisma.client";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../../shared/errors/custom-errors";

export class AttendancesService {
  /**
   * Confirm attendance to a route call
   */
  async confirmAttendance(userId: string, routeCallId: string) {
    // Verify route call exists
    const routeCall = await prisma.routeCall.findUnique({
      where: { id: routeCallId },
      select: { id: true, status: true, organizerId: true },
    });

    if (!routeCall) {
      throw new NotFoundError("Route call not found");
    }

    // Cannot attend cancelled or completed route calls
    if (routeCall.status === "CANCELLED") {
      throw new BadRequestError("Cannot attend a cancelled route call");
    }

    if (routeCall.status === "COMPLETED") {
      throw new BadRequestError("Cannot attend a completed route call");
    }

    // Check if user already has attendance (confirmed or cancelled)
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        routeCallId_userId: {
          routeCallId,
          userId,
        },
      },
    });

    // If attendance exists and is confirmed, cannot register again
    if (existingAttendance && existingAttendance.status === "CONFIRMED") {
      throw new ConflictError("You are already attending this route call");
    }

    // If attendance was cancelled before, reactivate it
    if (existingAttendance && existingAttendance.status === "CANCELLED") {
      const reactivated = await prisma.attendance.update({
        where: {
          routeCallId_userId: {
            routeCallId,
            userId,
          },
        },
        data: {
          status: "CONFIRMED",
          updatedAt: new Date(),
        },
        include: {
          routeCall: {
            select: {
              id: true,
              title: true,
              dateRoute: true,
              pace: true,
              status: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      });

      return reactivated;
    }

    // Create new attendance
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        routeCallId,
        status: "CONFIRMED",
      },
      include: {
        routeCall: {
          select: {
            id: true,
            title: true,
            dateRoute: true,
            pace: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    return attendance;
  }

  /**
   * Cancel attendance to a route call
   */
  async cancelAttendance(userId: string, routeCallId: string) {
    // Check if attendance exists
    const attendance = await prisma.attendance.findUnique({
      where: {
        routeCallId_userId: {
          routeCallId,
          userId,
        },
      },
    });

    if (!attendance) {
      throw new NotFoundError("Attendance not found");
    }

    // Check if already cancelled
    if (attendance.status === "CANCELLED") {
      throw new BadRequestError("Attendance is already cancelled");
    }

    // Update status to cancelled
    const cancelled = await prisma.attendance.update({
      where: {
        routeCallId_userId: {
          routeCallId,
          userId,
        },
      },
      data: {
        status: "CANCELLED",
        updatedAt: new Date(),
      },
      include: {
        routeCall: {
          select: {
            id: true,
            title: true,
            dateRoute: true,
          },
        },
      },
    });

    return cancelled;
  }

  /**
   * Get all attendances for a route call
   */
  async getRouteCallAttendances(routeCallId: string) {
    // Verify route call exists
    const routeCall = await prisma.routeCall.findUnique({
      where: { id: routeCallId },
      select: { id: true },
    });

    if (!routeCall) {
      throw new NotFoundError("Route call not found");
    }

    // Get all confirmed attendances
    const attendances = await prisma.attendance.findMany({
      where: {
        routeCallId,
        status: "CONFIRMED",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return attendances;
  }

  /**
   * Get all attendances for a user (my attendances)
   */
  async getUserAttendances(userId: string) {
    const attendances = await prisma.attendance.findMany({
      where: {
        userId,
        status: "CONFIRMED",
      },
      include: {
        routeCall: {
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
        },
      },
      orderBy: {
        routeCall: {
          dateRoute: "asc",
        },
      },
    });

    return attendances;
  }
}
