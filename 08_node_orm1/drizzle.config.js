import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./drizzle/schema.js",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
