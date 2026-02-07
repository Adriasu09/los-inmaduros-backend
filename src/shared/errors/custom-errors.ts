/**
 * Base class for all custom errors.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 - Bad Request
 * For invalid data or incorrect parameters
 */
export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

/**
 * 401 - Unauthorized
 * For users not authenticated
 */
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/**
 * 403 - Forbidden
 * For authenticated users without permissions
 */
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

/**
 * 404 - Not Found
 * For resources that do not exist
 */
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/**
 * 409 - Conflict
 * For conflicts like duplicates
 */
export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

/**
 * 422 - Unprocessable Entity
 * For business validation errors
 */
export class ValidationError extends AppError {
  constructor(message = "Validation Error") {
    super(message, 422);
  }
}

/**
 * 500 - Internal Server Error
 * For unexpected server errors
 */
export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, 500, false); // isOperational = false
  }
}