/** @type {import('jest').Config} */
// S1-04: DB-backed tests that need a live Postgres (DATABASE_URL) and the
// actual migrations/grants applied first. Run via `pnpm test:integration`,
// separately from the unit suite (jest.config.cjs) so the no-DB "checks" CI
// job never picks these up.
module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  testRegex: ".*\\.integration-spec\\.ts$",
  moduleFileExtensions: ["js", "json", "ts"],
  testTimeout: 30_000,
};
