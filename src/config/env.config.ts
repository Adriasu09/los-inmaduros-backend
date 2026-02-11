import dotenv from "dotenv";

dotenv.config();

export const PORT = getPort();
export const DATABASE_URL = process.env.DATABASE_URL;
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
export const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const FRONTEND_URL = process.env.FRONTEND_URL;

function getPort(): number {
  const port = parseInt(process.env.PORT || "4000", 10);
  if (isNaN(port)) {
    throw new Error("PORT must be a valid number");
  }
  return port;
}

export function validateEnv(): void {
  const requiredEnvVars = [
    "DATABASE_URL",
    "CLERK_SECRET_KEY",
    "CLERK_PUBLISHABLE_KEY",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "FRONTEND_URL",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }

  console.log("✅ Environment variables validated successfully");
}

// Export env object for easier imports
export const env = {
  PORT,
  NODE_ENV,
  FRONTEND_URL,
  DATABASE_URL,
  CLERK_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
};