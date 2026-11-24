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
      // Rule 1: apps/api modules talk to each other only through index.ts.
      "boundaries/entry-point": [
        "error",
        {
          default: "disallow",
          rules: [{ target: "api-module", allow: "index.ts" }],
        },
      ],
      // Rule 2: coarse-grained element types — apps never import each other,
      // and packages never import an app.
      "boundaries/element-types": [
        "error",
        {
          default: "allow",
          rules: [
            {
              from: "app-web",
              disallow: ["app-api"],
              message: "apps/web may not import apps/api.",
            },
            {
              from: "app-api",
              disallow: ["app-web"],
              message: "apps/api may not import apps/web.",
            },
            {
              from: "package",
              disallow: ["app-web", "app-api"],
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
