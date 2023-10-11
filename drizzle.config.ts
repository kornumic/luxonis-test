import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./.drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
