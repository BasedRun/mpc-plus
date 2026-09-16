import type { ProjectConfig, ReleaseConfig } from "@mpc-plus/core";

export interface XhsConfig {
  env: string;
  appid: string;
  token: string;
  project?: ProjectConfig;
  release?: ReleaseConfig;
}

// The official CLI declares Promise<unknown> and currently resolves null on success.
export type XhsUploadResult = unknown;
