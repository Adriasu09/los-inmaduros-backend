import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";

/**
 * Middleware to validate request data using Zod schemas
 * @param schema - Zod schema object with body, params, and/or query validators
 */
export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request data against schema
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // If validation passes, continue to next middleware/controller
      next();
    } catch (error) {
      // If validation fails, pass error to error handler middleware
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(error);
      }
    }
  };
};
