import { Client } from "pg";

// S1-04 acceptance criterion: "Migrations run from empty to latest without
// errors, locally and in CI." CI's api-integration job runs `pnpm db:migrate`
// as its own step before this suite, so a migration failure already fails
// the job; this test additionally proves every migration finished cleanly
// and left the expected tables behind, directly against the live database.
describe("migrations applied", () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  it("recorded all 5 S1-04 migrations as finished, with no rolled-back steps", async () => {
    const { rows } = await client.query(
      `select migration_name, finished_at, rolled_back_at
       from _prisma_migrations
       order by migration_name`,
    );
    const names = rows.map((row: { migration_name: string }) => row.migration_name);

    expect(names).toEqual(
      expect.arrayContaining([
        "0001_extensions",
        "0002_reference",
        "0003_platform",
        "0004_identity_family",
        "0005_roles_and_grants",
      ]),
    );
    for (const row of rows) {
      expect(row.finished_at).not.toBeNull();
      expect(row.rolled_back_at).toBeNull();
    }
  });

  it("created every table S1-04 adds", async () => {
    const { rows } = await client.query(
      `select table_name from information_schema.tables where table_schema = 'public'`,
    );
    const tableNames = new Set(rows.map((row: { table_name: string }) => row.table_name));

    const expectedTables = [
      "region",
      "district",
      "locality",
      "subject",
      "class_level",
      "curriculum",
      "organisation",
      "config_setting",
      "feature_flag",
      "audit_log",
      "outbox_event",
      "user_account",
      "user_role",
      "auth_session",
      "otp_challenge",
      "staff_profile",
      "staff_permission",
      "guardian_profile",
      "guardian_address",
      "child_profile",
      "child_subject",
      "consent_record",
    ];

    for (const table of expectedTables) {
      expect(tableNames.has(table)).toBe(true);
    }
  });
});
