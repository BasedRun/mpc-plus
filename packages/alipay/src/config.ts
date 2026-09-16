import type { ProjectConfig, ReleaseConfig } from "@mpc-plus/core";
import type { IUploadOptions, IPublishResult } from "minidev";

export type AlipayUploadOptions = Pick<IUploadOptions, "experience">;
export type AlipayUploadResult = IPublishResult;

export interface AlipayConfig {
  env: string;
  appid: string;
  identityKeyPath: string;
  project?: ProjectConfig;
  release?: ReleaseConfig;
  upload?: AlipayUploadOptions;
}
