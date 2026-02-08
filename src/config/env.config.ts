import dotenv from "dotenv";

dotenv.config();

export const PORT = getPort();
export const DATABASE_URL = process.env.DATABASE_URL;
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
export const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;

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
