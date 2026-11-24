import { jsAndPrettier } from "@tutor-link/config/eslint/base";
import boundaries from "@tutor-link/config/eslint/boundaries";
// eslint-config-next@16 ships real flat-config arrays (dist/*.js), so this is
// imported directly — no @eslint/eslintrc FlatCompat shim needed/wanted.
// next/typescript already bundles its own typescript-eslint config, so we use
// jsAndPrettier (not the shared default export) to avoid registering two
// different `@typescript-eslint` plugin instances under one config.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...jsAndPrettier,
  ...boundaries,
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default config;
