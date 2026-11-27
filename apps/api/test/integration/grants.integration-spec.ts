import { connectAsRole } from "./support/role-connection";

// 03-database.md §9 "Database roles" / "Sensitive columns", enforced by
// apps/api/prisma/migrations/0005_roles_and_grants. Run with a live
// database that already has 0005 applied (`pnpm db:migrate`).
describe("database role grants (03-database.md §9)", () => {
  it("tl_app cannot UPDATE audit_log — insert and select only", async () => {
    const client = await connectAsRole("tl_app");
    try {
      await expect(
        client.query("update audit_log set reason = 'x' where false"),
      ).rejects.toMatchObject({
        code: "42501", // insufficient_privilege
      });
    } finally {
      await client.end();
    }
  });

  it("tl_app cannot DELETE from audit_log", async () => {
    const client = await connectAsRole("tl_app");
    try {
      await expect(client.query("delete from audit_log where false")).rejects.toMatchObject({
        code: "42501",
      });
    } finally {
      await client.end();
    }
  });

  it("tl_app can INSERT and SELECT on audit_log", async () => {
    const client = await connectAsRole("tl_app");
    try {
      // Use a fresh, application-supplied UUID each run (not a DB function),
      // then roll back because tl_app intentionally cannot delete audit rows.
      const insertedId = `019acaa3-0000-7000-8000-${Date.now().toString(16).padStart(12, "0").slice(-12)}`;
      await client.query("begin");
      await expect(
        client.query(
          `insert into audit_log
             (id, action, target_type, reason, occurred_at)
           values ($1, 'integration.grant_test', 'integration_test', 'grant-test', now())`,
          [insertedId],
        ),
      ).resolves.toBeDefined();
      await expect(
        client.query("select id from audit_log where id = $1", [insertedId]),
      ).resolves.toMatchObject({ rowCount: 1 });
      await client.query("rollback");
    } finally {
      await client.end();
    }
  });

  it.each([
    "guardian_address",
    "child_profile",
    "child_subject",
    "consent_record",
    "staff_profile",
  ])("tl_readonly cannot SELECT from %s (Restricted-class data)", async (table) => {
    const client = await connectAsRole("tl_readonly");
    try {
      await expect(client.query(`select 1 from ${table} limit 1`)).rejects.toMatchObject({
        code: "42501",
      });
    } finally {
      await client.end();
    }
  });

  it("tl_readonly cannot SELECT confidential or authentication tables", async () => {
    const client = await connectAsRole("tl_readonly");
    try {
      for (const table of [
        "user_account",
        "auth_session",
        "otp_challenge",
        "audit_log",
        "outbox_event",
      ]) {
        await expect(client.query(`select 1 from ${table} limit 1`)).rejects.toMatchObject({
          code: "42501",
        });
      }
    } finally {
      await client.end();
    }
  });

  it("tl_readonly can SELECT from a non-restricted table", async () => {
    const client = await connectAsRole("tl_readonly");
    try {
      await expect(client.query("select 1 from region limit 1")).resolves.toBeDefined();
    } finally {
      await client.end();
    }
  });

  it("tl_readonly cannot write to any table", async () => {
    const client = await connectAsRole("tl_readonly");
    try {
      await expect(
        client.query("insert into region (id, name) values (gen_random_uuid(), 'x')"),
      ).rejects.toMatchObject({ code: "42501" });
    } finally {
      await client.end();
    }
  });

  it.each(["tl_app", "tl_readonly"] as const)(
    "%s cannot read or falsify Prisma migration history",
    async (role) => {
      const client = await connectAsRole(role);
      try {
        await expect(
          client.query("select migration_name from _prisma_migrations limit 1"),
        ).rejects.toMatchObject({ code: "42501" });
        await expect(
          client.query(
            `insert into _prisma_migrations
               (id, checksum, migration_name, started_at, applied_steps_count)
             values ('grant-test', 'grant-test', 'grant-test', now(), 0)`,
          ),
        ).rejects.toMatchObject({ code: "42501" });
      } finally {
        await client.end();
      }
    },
  );
});
