import { spawnSync } from "node:child_process";

// S1-04 acceptance criterion: "`prisma migrate diff` shows no drift between
// the Prisma schema and the database." `db:diff` runs `prisma migrate diff
// --exit-code`, which exits 0 for no drift, 2 if there is a difference.
//
// This asserts only the exit code, not an exact output string: Prisma's CLI
// prints its own "Update available" banner on stdout whenever a newer
// version exists on npm, which is outside this repo's control and previously
// broke this test by not matching the fixed "No difference detected."
// string. `--exit-code` is the contract Prisma documents for scripting this
// check; the human-readable text is informational, not something to pin.
describe("prisma migrate diff", () => {
  it("reports no drift between schema.prisma and the live database", () => {
    const result = spawnSync("node", ["./scripts/db-diff.mjs"], {
      cwd: process.cwd(), // apps/api — jest's rootDir
      env: process.env,
      encoding: "utf8",
    });

    if (result.status !== 0) {
      // Print the actual diff so a real schema/database mismatch is
      // readable from CI output instead of just a bare "expected 0" failure.
      console.error(
        `db:diff exited ${result.status} — stdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
      );
    }

    expect(result.status).toBe(0);
  });
});
