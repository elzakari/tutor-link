// Lints repo-root JavaScript (commitlint.config.cjs, scripts/*.mjs,
// prettier.config.mjs, this file) that sits outside every workspace's own
// `eslint .`. Not wired into any workspace's "lint" script or turbo's
// pipeline — lint-staged (.lintstagedrc.json) is what actually runs ESLint
// against these files, on commit, scoped to root-level *.js/*.mjs/*.cjs.
import { jsAndPrettier } from "@tutor-link/config/eslint/base";

export default jsAndPrettier;
