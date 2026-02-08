import express, { Application, Request, Response } from "express";
import cors from "cors";
import { envConfig } from "./config/env.config";
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
} from "./modules";

// Import error middlewares
import {
  errorHandler,
  notFoundHandler,
} from "./shared/middlewares/error.middleware";

// Create Express application
const app: Application = express();

// ==================== MIDDLEWARES ====================
// CORS - Allow requests from frontend
app.use(
  cors({
    origin: envConfig.frontendUrl,
    credentials: true,
  }),
);

// Body parser - To read JSON in requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== ROUTES ====================

// Health check (with DB verification)
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
app.use("/api/routes/:routeId/reviews", reviewsNestedRouter); // Nested reviews under routes
app.use("/api/reviews", reviewsRouter); // Direct reviews operations
app.use("/api/routes/:routeId/favorites", favoritesNestedRouter); // Nested favorites under routes
app.use("/api/favorites", favoritesRouter); // Direct favorites operations
app.use("/api/config", configRouter); // Configuration constants
app.use("/api/route-calls", routeCallsRouter); // Route calls management
app.use("/api/route-calls/:routeCallId/attendances", attendancesNestedRouter); // Nested attendances under route calls
app.use("/api/attendances", attendancesRouter); // Direct attendances operations
app.use("/api/photos", photosRouter); // Photos management

// ==================== ERROR HANDLING ====================
// 404 handler - Must be after all routes
app.use(notFoundHandler);

// Global error handler - Must be the last middleware
app.use(errorHandler);

// ==================== START SERVER ====================
const PORT = envConfig.port;

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
  ║   Environment: ${envConfig.nodeEnv}         ║
  ║   Database: ✅ Connected               ║
  ║   Status: ✅ Running                   ║
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
