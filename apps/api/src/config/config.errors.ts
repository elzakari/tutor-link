// Thrown by load-app-config.ts when process.env fails envSchema. Kept as a
// plain Error subclass (not a process.exit call) so the parsing logic stays
// unit-testable; only main.ts, at actual boot, turns this into a
// process.exit(1) (CLAUDE.md "How to work on a task" — small, reviewable,
// testable steps).
export class InvalidConfigError extends Error {
  constructor(public readonly problems: readonly string[]) {
    super(["Invalid environment configuration:", ...problems.map((p) => `  - ${p}`)].join("\n"));
    this.name = "InvalidConfigError";
  }
}
