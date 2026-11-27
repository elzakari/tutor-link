import { spawnSync } from "node:child_process";

// S1-04 acceptance criterion: "`prisma migrate diff` shows no drift between
// the Prisma schema and the database." `db:diff` runs `prisma migrate diff
// --exit-code`, which exits 0 for no drift, 2 if there is a difference.
describe("prisma migrate diff", () => {
  it("reports no drift between schema.prisma and the live database", () => {
    const result = spawnSync("node", ["./scripts/db-diff.mjs"], {
      cwd: process.cwd(), // apps/api — jest's rootDir
      env: process.env,
      encoding: "utf8",
    });

    expect({
      status: result.status,
      output: `${result.stdout}\n${result.stderr}`.trim(),
    }).toEqual({ status: 0, output: "No difference detected." });
  });
});
