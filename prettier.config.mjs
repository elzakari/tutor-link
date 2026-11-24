// Root Prettier config so `prettier --check .` / `prettier --write .` (run
// from the repo root by `pnpm format` and by lint-staged) use the same rules
// every workspace's own config re-exports from packages/config.
import config from "@tutor-link/config/prettier";

export default config;
