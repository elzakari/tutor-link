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

const ignores = {
  ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**", "**/coverage/**", "**/.turbo/**"],
};

const cjsConfigFiles = {
  // Node-authored CommonJS config files (jest.config.cjs, commitlint.config.cjs, ...).
  files: ["**/*.cjs"],
  languageOptions: {
    sourceType: "commonjs",
    globals: {
      module: "writable",
      exports: "writable",
      require: "readonly",
      process: "readonly",
      __dirname: "readonly",
      __filename: "readonly",
      console: "readonly",
    },
  },
};

export const jsAndPrettier = [ignores, js.configs.recommended, prettierConfig, cjsConfigFiles];

export default [
  ignores,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  cjsConfigFiles,
];
