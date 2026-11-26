// Public surface of the config module — the ONLY file other code may
// import from. See apps/api/README.md "Module layout convention".
export { loadAppConfig } from "./load-app-config";
export type { AppConfig } from "./load-app-config";
export { InvalidConfigError } from "./config.errors";
