import { spawnSync } from "node:child_process";
import { Client } from "pg";

// S1-04 acceptance criterion: "The seed runs twice without duplicates."
function runSeed() {
  const result = spawnSync("node", ["./scripts/db-seed.mjs"], {
    cwd: process.cwd(), // apps/api — jest's rootDir
    env: process.env,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`db:seed failed (exit ${result.status}): ${result.stderr || result.stdout}`);
  }
}

describe("db:seed idempotency", () => {
  let client: Client;

  beforeAll(async () => {
    runSeed();
    runSeed();
    client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  it("seeds exactly the 16 regions of Ghana, with no duplicate names", async () => {
    const { rows } = await client.query(
      "select count(*)::int as total, count(distinct name)::int as distinct_names from region",
    );
    expect(rows[0].total).toBe(16);
    expect(rows[0].total).toBe(rows[0].distinct_names);
  });

  it("seeds exactly one platform-default organisation", async () => {
    const { rows } = await client.query(
      "select count(*)::int as total from organisation where is_platform_default",
    );
    expect(rows[0].total).toBe(1);
  });

  it("seeds the 14 class levels with no duplicate names", async () => {
    const { rows } = await client.query(
      "select count(*)::int as total, count(distinct name)::int as distinct_names from class_level",
    );
    expect(rows[0].total).toBe(14);
    expect(rows[0].total).toBe(rows[0].distinct_names);
  });

  it("seeds subjects and curricula with no duplicate names", async () => {
    const subjectCounts = await client.query(
      "select count(*)::int as total, count(distinct name)::int as distinct_names from subject",
    );
    expect(subjectCounts.rows[0].total).toBe(subjectCounts.rows[0].distinct_names);

    const curriculumCounts = await client.query(
      "select count(*)::int as total, count(distinct name)::int as distinct_names from curriculum",
    );
    expect(curriculumCounts.rows[0].total).toBe(curriculumCounts.rows[0].distinct_names);
  });

  it("seeds districts and localities with no duplicates", async () => {
    const districtCounts = await client.query(
      "select count(*)::int as total, count(distinct (region_id, name))::int as distinct_names from district",
    );
    expect(districtCounts.rows[0].total).toBe(districtCounts.rows[0].distinct_names);

    const localityCounts = await client.query(
      "select count(*)::int as total, count(distinct (district_id, name))::int as distinct_names from locality",
    );
    expect(localityCounts.rows[0].total).toBe(localityCounts.rows[0].distinct_names);
  });
});
