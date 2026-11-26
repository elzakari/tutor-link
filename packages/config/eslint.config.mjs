// Lints this package's own config files (eslint/base.mjs, eslint/boundaries.mjs,
// prettier.config.mjs). They're plain ESM JS, not TypeScript, and they define
// the shared configs consumed by every other workspace, so they use the same
// `jsAndPrettier` base rather than importing boundaries/typescript-eslint
// recursively from themselves. Called by `pnpm --filter @tutor-link/config lint`
// (packages/config/package.json "lint" script) and by turbo's `pnpm lint`.
import { jsAndPrettier } from "./eslint/base.mjs";

export default jsAndPrettier;
