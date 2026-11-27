/** @type {import('jest').Config} */
module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  testRegex: ".*\\.spec\\.ts$",
  // DB-backed suites (S1-04) live in jest.integration.config.cjs instead —
  // this config must stay runnable with no Postgres/Redis present (the CI
  // "checks" job runs `pnpm test` with no service containers).
  testPathIgnorePatterns: ["/node_modules/", "\\.integration-spec\\.ts$"],
  moduleFileExtensions: ["js", "json", "ts"],
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "coverage",
};
