// Module-boundary enforcement (CLAUDE.md rule 19; 02-architecture.md §4 rules 1 and 6):
//   - a file inside apps/api/src/modules/<X> may import another module <Y> only
//     through apps/api/src/modules/<Y>/index.ts (never its internal/, repository/, etc.)
//   - apps/web and apps/api may not import each other
//   - packages/* may not import apps/*
//
// Spread this file's default export into any workspace's eslint.config.mjs that
// should be checked against these rules. Each workspace runs `eslint .` with its
// own directory as cwd, but element patterns below are written relative to the
// monorepo root — so `boundaries/root-path` is pinned to the repo root
// (resolved from this file's own location) rather than left at the plugin's
// default of `process.cwd()`, which would silently never match anything.
//
// Both rules below live under the single canonical `boundaries/dependencies`
// rule (object-based `from`/`to`/`allow`/`disallow` selectors). The plugin's
// older `boundaries/entry-point` and `boundaries/element-types` rules are
// deprecated aliases of this same rule and warn on every lint run — see
// https://www.jsboundaries.dev/docs/releases/migration-guides/v5-to-v6/.
// `boundaries/dependencies` evaluates its `rules` array in order with
// last-match-wins semantics (within one entry, `disallow` beats `allow`), so a
// later rule can re-allow what an earlier rule disallowed for the same `to`.
import boundaries from "eslint-plugin-boundaries";

const repoRoot = new URL("../../..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const elements = [
  // Most specific first: a module folder inside the API.
  {
    type: "api-module",
    pattern: "apps/api/src/modules/*",
    mode: "folder",
    capture: ["moduleName"],
  },
  { type: "app-api", pattern: "apps/api/**" },
  { type: "app-web", pattern: "apps/web/**" },
  { type: "package", pattern: "packages/*/src/**" },
];

export default [
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/root-path": repoRoot,
      "boundaries/elements": elements,
      "boundaries/ignore": ["**/*.spec.ts", "**/*.test.ts"],
      // Without this, boundaries' bundled eslint-import-resolver-node only
      // resolves .js/.json, so every extensionless TS import target shows up
      // as "unknown" and silently skips every rule below.
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          rules: [
            // Rule 1 (was boundaries/entry-point): apps/api modules talk to
            // each other only through index.ts. First disallow every
            // cross-module dependency into an api-module, then re-allow the
            // one path (internalPath "index.ts") that may be imported — the
            // later, more specific rule wins over the earlier blanket one.
            // (Same-module imports never reach these rules at all: the
            // dependencies rule skips internal — same-instance — dependencies
            // by default. The `disallow` selector restates the rule's own
            // `to` on purpose: an empty `{}` selector is rejected by the
            // plugin as invalid rather than treated as "match everything".)
            {
              to: { type: "api-module" },
              disallow: { to: { type: "api-module" } },
            },
            {
              to: { type: "api-module" },
              allow: { to: { internalPath: "index.ts" } },
            },
            // Rule 2 (was boundaries/element-types): coarse-grained element
            // types — apps never import each other, and packages never
            // import an app.
            {
              // `to: { type: "app-api" }` alone misses anything under
              // apps/api/src/modules/*, because the `api-module` element
              // (declared above, more specific, matched first) claims those
              // files instead of `app-api` — so this disallow must name
              // both types or a web import of an API module's internals
              // (or even its index.ts) would silently pass.
              from: { type: "app-web" },
              disallow: { to: { type: ["app-api", "api-module"] } },
              message: "apps/web may not import apps/api.",
            },
            {
              from: { type: "app-api" },
              disallow: { to: { type: "app-web" } },
              message: "apps/api may not import apps/web.",
            },
            {
              from: { type: "package" },
              disallow: { to: { type: ["app-web", "app-api"] } },
              message: "packages/* may not import from an app.",
            },
          ],
        },
      ],
      "boundaries/no-unknown": "off",
      "boundaries/no-unknown-files": "off",
    },
  },
];
