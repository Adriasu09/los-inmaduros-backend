import { createClient } from "@supabase/supabase-js";
import { env } from "./env.config";

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);