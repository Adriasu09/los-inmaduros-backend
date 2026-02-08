import { z } from "zod";

/**
 * Schema for confirming attendance to a route call
 */
export const confirmAttendanceSchema = z.object({
  params: z.object({
    routeCallId: z.string().uuid("Must be a valid UUID"),
  }),
});

/**
 * Schema for cancelling attendance
 */
export const cancelAttendanceSchema = z.object({
  params: z.object({
    routeCallId: z.string().uuid("Must be a valid UUID"),
  }),
});

/**
 * Schema for getting attendances of a route call
 */
export const getRouteCallAttendancesSchema = z.object({
  params: z.object({
    routeCallId: z.string().uuid("Must be a valid UUID"),
  }),
});
