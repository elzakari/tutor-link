// Spawns the local Prisma CLI by resolving its entry point and running it
// directly with `node`, instead of `pnpm exec prisma` (which resolves to a
// `.cmd`/`.bat` shim on Windows).
//
// Current Node on Windows (a security hardening change, see
// https://nodejs.org/en/blog/vulnerability/cve-2024-27980) refuses to
// `spawn()` a `.cmd`/`.bat` file unless `shell: true` is passed. Passing
// `shell: true` here would put DATABASE_URL and other arguments through
// unescaped shell concatenation (db-diff.mjs puts DATABASE_URL on the
// command line) instead of execve's one-argument-per-array-element
// semantics. Resolving Prisma's own CLI script and running it with the same
// Node binary avoids both problems: no shell, no `.cmd` file, nothing to
// escape, and it behaves identically on Windows, macOS and Linux.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export function runPrismaCli(args, { cwd }) {
  const prismaCliEntry = require.resolve("prisma/build/index.js");
  return spawn(process.execPath, [prismaCliEntry, ...args], {
    cwd,
    stdio: "inherit",
    // Prisma's CLI prints an "Update available" banner on stdout whenever a
    // newer version exists, independent of anything this repo controls —
    // it broke prisma-diff.integration-spec.ts, which used to match db:diff's
    // output against a fixed string. Suppressing it keeps every Prisma CLI
    // call's output limited to what the command itself reports.
    env: { ...process.env, PRISMA_HIDE_UPDATE_MESSAGE: "1" },
  });
}
