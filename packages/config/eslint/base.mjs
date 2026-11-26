// Shared flat ESLint base for every workspace (02-architecture.md §4 rule 6:
// "A lint rule blocks imports across module internals").
// Each app/package's own eslint.config.mjs spreads this first, then layers
// framework-specific config (e.g. eslint-config-next) and, for apps/api only,
// the module-boundary rules in ./boundaries.mjs.
//
// apps/web uses `jsAndPrettier` (not the default export): eslint-config-next's
// own "next/typescript" already bundles its own `typescript-eslint` instance,
// and ESLint 9 flat config refuses to load two different `@typescript-eslint`
// plugin object references under the same config, so apps/web must not also
// bring in this package's separate typescript-eslint copy.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

const ignores = {
  ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**", "**/coverage/**", "**/.turbo/**"],
};

const nodeConfigFileGlobals = {
  // Node-authored config/tooling scripts (jest.config.cjs,
  // commitlint.config.cjs, eslint.config.mjs, prettier.config.mjs,
  // scripts/*.mjs, ...) always run under Node, never bundled for a browser,
  // so they get Node's global identifiers (process, console, URL,
  // __dirname, ...) directly. TypeScript source never needs this: it sees
  // the same globals through @types/node's ambient declarations instead.
  files: ["**/*.cjs", "**/*.mjs"],
  languageOptions: {
    globals: globals.node,
  },
};

const cjsConfigFiles = {
  // Node-authored CommonJS config files (jest.config.cjs, commitlint.config.cjs, ...).
  files: ["**/*.cjs"],
  languageOptions: {
    sourceType: "commonjs",
  },
};

export const jsAndPrettier = [
  ignores,
  js.configs.recommended,
  prettierConfig,
  nodeConfigFileGlobals,
  cjsConfigFiles,
];

export default [
  ignores,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  nodeConfigFileGlobals,
  cjsConfigFiles,
];
