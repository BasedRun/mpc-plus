import type { ProjectConfig, ReleaseConfig } from "@mpc-plus/core";
import type { upload as douyinUpload } from "tt-ide-cli";

type DouyinSdkUploadOptions = Parameters<typeof douyinUpload>[0];

export type DouyinUploadOptions = Pick<DouyinSdkUploadOptions, "channel" | "needUploadSourcemap">;

export type DouyinUploadResult = Awaited<ReturnType<typeof douyinUpload>>;

export interface DouyinConfig {
  env: string;
  appid: string;
  token: string;
  project?: ProjectConfig;
  release?: ReleaseConfig;
  upload?: DouyinUploadOptions;
}
