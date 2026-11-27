// Minimal `.env` loader shared by apps/api/scripts/db-*.mjs.
//
// Not using the `dotenv` package: this is a handful of lines and keeps the
// script dependency-free. A value already set in process.env is never
// overwritten, so CI's job-level env (DATABASE_URL, REDIS_URL, ...) always
// wins over a committed apps/api/.env file — and a missing .env file (CI,
// or a machine that hasn't run `cp .env.example .env` yet) is not an error
// here; the caller is responsible for checking the variables it needs.
import { existsSync, readFileSync } from "node:fs";

export function loadDotEnv(path) {
  if (!existsSync(path)) return;

  const content = readFileSync(path, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    const isQuoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (isQuoted) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
