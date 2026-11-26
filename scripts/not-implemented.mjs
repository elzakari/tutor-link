#!/usr/bin/env node
// Root-level infra scripts (docker:up, db:migrate, db:seed, ...) call this
// until the task that implements them lands (see CLAUDE.md "Commands").
// It must exit 0 so `pnpm <script>` never fails a clean-clone check.
const scriptName = process.argv[2] ?? "this script";
console.log(`"${scriptName}" is not yet implemented.`);
process.exit(0);
