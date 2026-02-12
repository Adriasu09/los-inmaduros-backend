import rateLimit from "express-rate-limit";

/**
 * General rate limiter for all API endpoints
 * Limits: 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for authentication endpoints
 * Limits: 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per window
  message: {
    success: false,
    error: "Too many authentication attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Moderate rate limiter for creation endpoints
 * Limits: 20 requests per 15 minutes per IP
 */
export const creationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 requests per window
  message: {
    success: false,
    error: "Too many creation requests, please slow down",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
