import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export const db = drizzle({
  client: neon(process.env.DATABASE_URL!),
  schema,
  casing: "snake_case",
  logger: process.env.NODE_ENV === "development",
});
