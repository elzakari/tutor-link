#!/usr/bin/env node
// `pnpm db:diff` — S1-04 acceptance criterion: "`prisma migrate diff` shows
// no drift between the Prisma schema and the database." `--exit-code` makes
// this exit 0 when there is no drift and 2 when there is (prisma-diff.
// integration-spec.ts asserts on that), separately from the human-readable
// diff printed either way.
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadDotEnv } from "./lib/load-dotenv.mjs";
import { runPrismaCli } from "./lib/run-prisma.mjs";

const apiRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

loadDotEnv(join(apiRoot, ".env"));

if (!process.env.DATABASE_URL) {
  console.error("db:diff: DATABASE_URL is not set.");
  process.exit(1);
}

const prisma = runPrismaCli(
  [
    "migrate",
    "diff",
    "--from-url",
    process.env.DATABASE_URL,
    "--to-schema-datamodel",
    "prisma/schema.prisma",
    "--exit-code",
  ],
  { cwd: apiRoot },
);

prisma.on("error", (error) => {
  console.error("db:diff: failed to start Prisma CLI:", error.message);
  process.exit(1);
});

prisma.on("exit", (code, signal) => {
  if (signal) {
    console.error(`db:diff: Prisma CLI was terminated by signal ${signal}.`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
