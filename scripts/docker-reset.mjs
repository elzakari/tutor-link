#!/usr/bin/env node
// `pnpm docker:reset` — stops the local dev services and deletes their data
// volumes (Postgres and MinIO data). Destructive, so it always asks first
// (S1-02 "reset wipes volumes, after asking for confirmation").
import { createInterface } from "node:readline";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const composeFile = join(repoRoot, "infra", "docker", "docker-compose.yml");

function ask(question) {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      // No interactive terminal to confirm in (e.g. a CI job) — refuse
      // rather than silently deleting data.
      resolve(false);
      return;
    }
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "yes");
    });
  });
}

const confirmed = await ask(
  'This deletes all local Postgres and MinIO data for tutor-link. Type "yes" to continue: ',
);

if (!confirmed) {
  console.log("docker:reset cancelled — no data was deleted.");
  process.exit(0);
}

const result = spawnSync("docker", ["compose", "-f", composeFile, "down", "--volumes"], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
