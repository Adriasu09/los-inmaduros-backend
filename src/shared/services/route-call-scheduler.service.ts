import cron from "node-cron";
import { prisma } from "../../database/prisma.client";

const ROUTE_CALL_DURATION_HOURS = 2;

/**
 * Batch-update route call statuses based on time:
 * - SCHEDULED -> ONGOING when dateRoute <= now
 * - ONGOING -> COMPLETED when dateRoute + 2h <= now
 */
export async function updateRouteCallStatuses(): Promise<void> {
  const now = new Date();
  const twoHoursAgo = new Date(
    now.getTime() - ROUTE_CALL_DURATION_HOURS * 60 * 60 * 1000,
  );

  try {
    // Transition SCHEDULED -> ONGOING
    const ongoingResult = await prisma.routeCall.updateMany({
      where: {
        status: "SCHEDULED",
        dateRoute: { lte: now },
      },
      data: { status: "ONGOING" },
    });

    // Transition ONGOING -> COMPLETED
    const completedResult = await prisma.routeCall.updateMany({
      where: {
        status: "ONGOING",
        dateRoute: { lte: twoHoursAgo },
      },
      data: { status: "COMPLETED" },
    });

    if (ongoingResult.count > 0 || completedResult.count > 0) {
      console.log(
        `[RouteCallScheduler] Transitions: ${ongoingResult.count} -> ONGOING, ${completedResult.count} -> COMPLETED`,
      );
    }
  } catch (error) {
    console.error("[RouteCallScheduler] Error updating statuses:", error);
  }
}

/**
 * Initialize the cron job that runs every minute.
 * Runs immediately on startup to catch up on missed transitions.
 */
export function initRouteCallScheduler(): void {
  // Run immediately on startup
  void updateRouteCallStatuses();

  // Then run every minute
  cron.schedule("* * * * *", () => {
    void updateRouteCallStatuses();
  });

  console.log("[RouteCallScheduler] Cron job initialized (every minute)");
}
