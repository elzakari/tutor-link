// Integration tests do not need login passwords for the group roles created
// by infra/db/roles.sql. They connect with the CI/local admin DATABASE_URL,
// then `SET ROLE` for the duration of one client so Postgres enforces the
// exact privileges of tl_app or tl_readonly. The admin used by local/CI must
// be allowed to SET ROLE (the Docker superuser is).
import { Client } from "pg";

const ROLES = ["tl_app", "tl_readonly"] as const;
export type GrantedRole = (typeof ROLES)[number];

export async function connectAsRole(role: GrantedRole): Promise<Client> {
  if (!ROLES.includes(role)) {
    throw new Error(`Unsupported integration-test role: ${role}`);
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — integration tests need a live database.");
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  // `role` is constrained to the literal allowlist above; do not accept user
  // input here or turn this into an arbitrary identifier interpolation.
  await client.query(`set role ${role}`);
  return client;
}
