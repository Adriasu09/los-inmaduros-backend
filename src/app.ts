import express, { Application, Request, Response } from "express";
import cors from "cors";
import { envConfig } from "./config/env.config";
import { connectDatabase, prisma } from "./database/prisma.client";

// Importar rutas
import routesRouter from "./modules/routes/routes.routes";
import reviewsRouter from "./modules/reviews/reviews.routes";

// Crear la aplicación Express
const app: Application = express();

// ==================== MIDDLEWARES ====================
// CORS - Permitir peticiones desde el frontend
app.use(
  cors({
    origin: envConfig.frontendUrl,
    credentials: true,
  }),
);

// Body parser - Para leer JSON en las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== RUTAS ====================

// Health check (ahora con verificación de DB)
app.get("/health", async (req: Request, res: Response) => {
  try {
    // Verificar conexión a la base de datos
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

// ✅ Rutas de la API
app.use("/api/routes", routesRouter);
app.use("/api/routes", reviewsRouter); // Reviews anidadas: /api/routes/:routeId/reviews
app.use("/api/reviews", reviewsRouter); // Reviews directas: /api/reviews/:reviewId

// Ruta 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// ==================== INICIAR SERVIDOR ====================
const PORT = envConfig.port;

async function startServer() {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Iniciar servidor
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
