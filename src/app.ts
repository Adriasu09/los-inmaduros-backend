import express, { Application, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { PORT, validateEnv } from "./config/env.config";
import { swaggerSpec } from "./config/swagger.config";
import { connectDatabase, prisma } from "./database/prisma.client";

// Import routes
import {
  routesRouter,
  reviewsRouter,
  reviewsNestedRouter,
  favoritesRouter,
  favoritesNestedRouter,
  configRouter,
  routeCallsRouter,
  attendancesRouter,
  attendancesNestedRouter,
  photosRouter,
  authRouter,
} from "./modules";

// Import error middlewares
import {
  errorHandler,
  notFoundHandler,
} from "./shared/middlewares/error.middleware";

// Validate environment variables
validateEnv();

// Create Express application
const app: Application = express();

// ==================== MIDDLEWARES ====================
// CORS - Allow requests from frontend
app.use(
  cors({
    origin: "*", // Change this to your frontend URL in production
    credentials: true,
  }),
);

// Body parser - Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== SWAGGER DOCUMENTATION ====================
// Swagger UI - Available at /api-docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Los Inmaduros API Docs",
  }),
);

// Swagger JSON spec - Available at /api-docs.json
app.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ==================== ROUTES ====================

// Health check endpoint
app.get("/health", async (req: Request, res: Response) => {
  try {
    // Verify database connection
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "OK",
      message: "Los Inmaduros Backend is running! 🛼",
      timestamp: new Date().toISOString(),
      database: "Connected ✅",
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
      database: "Disconnected ❌",
    });
  }
});

// API routes
app.use("/api/routes", routesRouter);
app.use("/api/routes/:routeId/reviews", reviewsNestedRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/routes/:routeId/favorites", favoritesNestedRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/config", configRouter);
app.use("/api/route-calls", routeCallsRouter);
app.use("/api/route-calls/:routeCallId/attendances", attendancesNestedRouter);
app.use("/api/attendances", attendancesRouter);
app.use("/api/photos", photosRouter);
app.use("/api/auth", authRouter); // TODO: Remove in production

// ==================== ERROR HANDLING ====================
// 404 handler - Must be after all routes
app.use(notFoundHandler);

// Global error handler - Must be the last middleware
app.use(errorHandler);

// ==================== START SERVER ====================
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`
  ╔════════════════════════════════════════╗
  ║   🛼 Los Inmaduros Backend Server   ║
  ╠════════════════════════════════════════╣
  ║   Port: ${PORT}                        ║
  ║   Environment: development             ║
  ║   Database: ✅ Connected               ║
  ║   Status: ✅ Running                   ║
  ║                                        ║
  ║   📖 API Docs: /api-docs               ║
  ╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
