import { Request, Response, NextFunction } from "express";
import { createClerkClient, verifyToken } from "@clerk/express";
import { CLERK_SECRET_KEY } from "../../config/env.config";
import { UnauthorizedError } from "../errors/custom-errors";
import { UserSyncService } from "../services/user-sync.service";

const userSyncService = new UserSyncService();
const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });

// Extend Express Request type to include auth data
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        clerkId: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to verify Clerk authentication token
 * Adds auth object to request with userId, clerkId, and role
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No authentication token provided");
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token with Clerk
    const sessionClaims = await verifyToken(token, {
      secretKey: CLERK_SECRET_KEY,
    });

    if (!sessionClaims || !sessionClaims.sub) {
      throw new UnauthorizedError("Invalid authentication token");
    }

    const clerkId = sessionClaims.sub;

    // Get or create user in our database
    const { userId, role } = await userSyncService.getOrCreateUser(clerkId);

    req.auth = {
      userId,
      clerkId,
      role,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      console.error("Authentication error:", error);
      next(new UnauthorizedError("Authentication failed"));
    }
  }
};

/**
 * Middleware to require admin role
 * Must be used after requireAuth
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.auth) {
    return next(new UnauthorizedError("Authentication required"));
  }

  if (req.auth.role !== "ADMIN") {
    return next(new UnauthorizedError("Admin access required"));
  }

  next();
};

/**
 * Optional auth middleware
 * Adds auth to request if token is present, but doesn't require it
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token provided, continue without auth
      return next();
    }

    const token = authHeader.substring(7);

    const sessionClaims = await verifyToken(token, {
      secretKey: CLERK_SECRET_KEY,
    });

    if (sessionClaims && sessionClaims.sub) {
      const clerkId = sessionClaims.sub;
      const { userId, role } = await userSyncService.getOrCreateUser(clerkId);

      req.auth = {
        userId,
        clerkId,
        role,
      };
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without auth
    next();
  }
};
