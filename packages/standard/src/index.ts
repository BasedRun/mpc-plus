export { defineConfig } from "./config.ts";
export type { MPCConfig, StandardPlatformsConfig } from "./config.ts";

export { createStandardMPC, resolvePlatformConfig } from './runtime.ts'