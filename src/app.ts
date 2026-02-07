import express, { Application, Request, Response } from "express";
import cors from "cors";
import { envConfig } from "./config/env.config";
import { connectDatabase, prisma } from "./database/prisma.client";

// Import routes
import routesRouter from "./modules/routes/routes.routes";
import reviewsRouter from "./modules/reviews/reviews.routes";
import reviewsNestedRouter from "./modules/reviews/reviews.nested.routes";
import favoritesRouter from "./modules/favorites/favorites.routes";
import favoritesNestedRouter from "./modules/favorites/favorites.nested.routes";
import configRouter from "./modules/config/config.routes";
import routeCallsRouter from "./modules/route-calls/route-calls.routes";

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
