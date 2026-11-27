#!/usr/bin/env node
// `pnpm db:seed` (S1-04, docs/orchestration/sprint-1.md). Idempotent: lookup
// rows use `ON CONFLICT ... DO NOTHING` against real unique constraints and
// the platform organisation uses a serialised existence check inside the
// same transaction, so running this twice (or concurrently) never creates
// duplicates.
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { loadDotEnv } from "./lib/load-dotenv.mjs";

// Same RFC 9562 UUID v7 algorithm as apps/api/src/common/ids/new-id.ts —
// duplicated here (not imported) because this is a plain .mjs script with
// no TypeScript build step, and that file's own comment explains why the
// `uuid` npm package isn't used instead (uuid@14 is ESM-only and breaks
// under ts-jest; keeping both copies free of that package avoids the issue
// everywhere rather than just where it was first noticed).
function uuidv7() {
  const bytes = randomBytes(16);
  const unixTsMs = BigInt(Date.now());

  bytes[0] = Number((unixTsMs >> 40n) & 0xffn);
  bytes[1] = Number((unixTsMs >> 32n) & 0xffn);
  bytes[2] = Number((unixTsMs >> 24n) & 0xffn);
  bytes[3] = Number((unixTsMs >> 16n) & 0xffn);
  bytes[4] = Number((unixTsMs >> 8n) & 0xffn);
  bytes[5] = Number(unixTsMs & 0xffn);

  bytes[6] = (bytes[6] & 0x0f) | 0x70; // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10

  const hex = bytes.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

const apiRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(apiRoot, "..", "..");

loadDotEnv(join(apiRoot, ".env"));

if (!process.env.DATABASE_URL) {
  console.error("db:seed: DATABASE_URL is not set.");
  process.exit(1);
}

// Ghana's 16 regions (03-database.md §10: "All 16 regions... Official
// administrative lists, checked in Phase 0"). Fixed list, not a CSV sample.
const REGIONS = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
];

// KG 1 to SHS 3 (S1-04 task item 6 — this follows the task's literal level
// names, "JHS 1-3", rather than 03-database.md §10's "Basic 1 to 9"; both
// describe the same nine post-KG GES years, just two different naming
// conventions for them. Flagged as a decision in the S1-04 task report.)
const CLASS_LEVELS = [
  ["KG 1", "kg"],
  ["KG 2", "kg"],
  ["Basic 1", "primary"],
  ["Basic 2", "primary"],
  ["Basic 3", "primary"],
  ["Basic 4", "primary"],
  ["Basic 5", "primary"],
  ["Basic 6", "primary"],
  ["JHS 1", "jhs"],
  ["JHS 2", "jhs"],
  ["JHS 3", "jhs"],
  ["SHS 1", "shs"],
  ["SHS 2", "shs"],
  ["SHS 3", "shs"],
].map(([name, stage], index) => ({ name, stage, sortOrder: index + 1 }));

function parseCsv(content) {
  const lines = content
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));
  const [headerLine, ...rows] = lines;
  const header = headerLine.split(",").map((h) => h.trim());
  return rows.map((row) => {
    const cells = row.split(",").map((c) => c.trim());
    return Object.fromEntries(header.map((key, i) => [key, cells[i]]));
  });
}

async function seedOrganisation(client) {
  // The spec does not add a unique constraint to organisation, so use an
  // explicit existence check inside the seed transaction rather than
  // inventing one in the schema just to support ON CONFLICT.
  await client.query(
    `insert into organisation (id, name, type, is_platform_default, status)
     select $1, 'Tutor Link', 'platform', true, 'active'
     where not exists (select 1 from organisation where is_platform_default)`,
    [uuidv7()],
  );
}

async function seedRegions(client) {
  for (const name of REGIONS) {
    await client.query(
      `insert into region (id, name) values ($1, $2) on conflict (name) do nothing`,
      [uuidv7(), name],
    );
  }
}

async function seedClassLevels(client) {
  for (const level of CLASS_LEVELS) {
    await client.query(
      `insert into class_level (id, name, stage, sort_order)
       values ($1, $2, $3, $4) on conflict (name) do nothing`,
      [uuidv7(), level.name, level.stage, level.sortOrder],
    );
  }
}

async function seedSubjects(client) {
  const rows = parseCsv(
    readFileSync(join(repoRoot, "infra", "db", "seed", "subjects.csv"), "utf8"),
  );
  for (const row of rows) {
    await client.query(
      `insert into subject (id, name, slug) values ($1, $2, $3) on conflict (name) do nothing`,
      [uuidv7(), row.name, row.slug],
    );
  }
}

async function seedCurricula(client) {
  const rows = parseCsv(
    readFileSync(join(repoRoot, "infra", "db", "seed", "curricula.csv"), "utf8"),
  );
  for (const row of rows) {
    await client.query(
      `insert into curriculum (id, name) values ($1, $2) on conflict (name) do nothing`,
      [uuidv7(), row.name],
    );
  }
}

async function seedLocalities(client) {
  const rows = parseCsv(
    readFileSync(join(repoRoot, "infra", "db", "seed", "localities.csv"), "utf8"),
  );
  for (const row of rows) {
    const regionResult = await client.query("select id from region where name = $1", [row.region]);
    if (regionResult.rowCount === 0) {
      throw new Error(
        `db:seed: region "${row.region}" (from localities.csv) was not seeded — check the REGIONS list in this script.`,
      );
    }
    const regionId = regionResult.rows[0].id;

    await client.query(
      `insert into district (id, region_id, name) values ($1, $2, $3)
       on conflict (region_id, name) do nothing`,
      [uuidv7(), regionId, row.district],
    );
    const districtResult = await client.query(
      "select id from district where region_id = $1 and name = $2",
      [regionId, row.district],
    );
    const districtId = districtResult.rows[0].id;

    await client.query(
      `insert into locality (id, district_id, name, is_served) values ($1, $2, $3, $4)
       on conflict (district_id, name) do nothing`,
      [uuidv7(), districtId, row.locality, row.is_served === "true"],
    );
  }
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  // Serialises concurrent seed runs (not just repeat runs) and makes the
  // check-then-insert platform-organisation step race-free. Fixed advisory
  // lock key chosen for this one seed job; released automatically at COMMIT.
  await client.query("begin");
  await client.query("select pg_advisory_xact_lock(1414213562)");
  await seedOrganisation(client);
  await seedRegions(client);
  await seedClassLevels(client);
  await seedSubjects(client);
  await seedCurricula(client);
  await seedLocalities(client);
  await client.query("commit");
  console.log("db:seed: done.");
} catch (error) {
  await client.query("rollback");
  throw error;
} finally {
  await client.end();
}
