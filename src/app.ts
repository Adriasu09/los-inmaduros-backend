import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { envConfig } from './config/env.config';

// Crear la aplicación Express
const app: Application = express();

// ==================== MIDDLEWARES ====================
// CORS - Permitir peticiones desde el frontend
app.use(
  cors({
    origin: envConfig.frontendUrl,
    credentials: true,
  })
);

// Body parser - Para leer JSON en las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== RUTAS ====================

// Ruta de prueba (Health check)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Los Inmaduros Backend is running! 🛼',
    timestamp: new Date().toISOString(),
  });
});

// Ruta 404 - Cuando no se encuentra una ruta
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// ==================== INICIAR SERVIDOR ====================
const PORT = envConfig.port;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🛼 Los Inmaduros Backend Server      ║
  ╠════════════════════════════════════════╣
  ║   Port: ${PORT}                        ║
  ║   Environment: ${envConfig.nodeEnv}    ║
  ║   Status: ✅ Running                   ║
  ╚════════════════════════════════════════╝
  `);
});

export default app;