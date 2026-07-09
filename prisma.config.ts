import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  // CLI commands (migrate, studio) use the direct connection.
  datasource: {
    url: env("DIRECT_URL"),
  },
});

