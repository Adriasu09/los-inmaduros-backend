import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/custom-errors";
import { NODE_ENV } from "../../config/env.config";

/**
 * Global error handling middleware
 * Catches ALL application errors and converts them to appropriate HTTP responses
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  // 1. Custom application errors (AppError)
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  // 2. Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // 3. Prisma errors (Database)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint violation (duplicate)
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "A record with this value already exists",
        field: error.meta?.target,
      });
    }

    // P2025: Record not found
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Record not found",
      });
    }

    // P2003: Foreign key constraint violation
    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        error: "Invalid reference to related record",
        field: error.meta?.field_name,
      });
    }
  }

  // 4. Other Prisma errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      error: "Invalid data format",
    });
  }

  // 5. Generic unhandled error
  console.error("❌ Unhandled Error:", error);

  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
    ...(NODE_ENV === "development" && {
      details: error.message,
      stack: error.stack,
    }),
  });
}

/**
 * Middleware to handle 404 not found routes
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
  });
}
