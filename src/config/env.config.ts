import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Validate and parse environment variables
 */
const getPort = (): number => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

  if (isNaN(port)) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}`);
  }

  return port;
};

/**
 * Validate required environment variables
 */
const validateEnv = () => {
  const required = ["DATABASE_URL"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

// Validate on startup
validateEnv();

export const envConfig = {
  port: getPort(),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  database: {
    url: process.env.DATABASE_URL!,
  },
  supabase: {
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || "",
  },
};
