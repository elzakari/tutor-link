#!/usr/bin/env node
// `pnpm db:migrate` (S1-04, docs/orchestration/sprint-1.md).
//
// 1. Ensures the cluster-level roles exist (infra/db/roles.sql — idempotent,
//    see that file's own comment on why running it every time is safe).
// 2. Applies every Prisma migration in apps/api/prisma/migrations, in order.
//
// Both steps run against DATABASE_URL — the same connection apps/api/.env
// (or CI's job env) already provides for the app itself. See
// infra/db/roles.sql's comment on tl_migrator for why this is not yet a
// separate "run as tl_migrator" step.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { loadDotEnv } from "./lib/load-dotenv.mjs";
import { runPrismaCli } from "./lib/run-prisma.mjs";

const apiRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(apiRoot, "..", "..");

loadDotEnv(join(apiRoot, ".env"));

if (!process.env.DATABASE_URL) {
  console.error(
    "db:migrate: DATABASE_URL is not set (copy apps/api/.env.example to apps/api/.env, or set it in the environment).",
  );
  process.exit(1);
}

async function ensureRoles() {
  const rolesSqlPath = join(repoRoot, "infra", "db", "roles.sql");
  const sql = readFileSync(rolesSqlPath, "utf8");
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(sql);
    console.log("db:migrate: tl_migrator / tl_app / tl_readonly roles ensured.");
  } finally {
    await client.end();
  }
}

try {
  await ensureRoles();
} catch (error) {
  console.error("db:migrate: failed to ensure cluster roles (infra/db/roles.sql):", error.message);
  process.exit(1);
}

const prisma = runPrismaCli(["migrate", "deploy"], { cwd: apiRoot });

prisma.on("error", (error) => {
  console.error("db:migrate: failed to start Prisma CLI:", error.message);
  process.exit(1);
});

prisma.on("exit", (code, signal) => {
  if (signal) {
    console.error(`db:migrate: Prisma CLI was terminated by signal ${signal}.`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
