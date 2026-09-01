import type {ProjectConfig, ReleaseConfig} from "@mpc-plus/core";
import type {upload as miniprogramUpload} from "miniprogram-ci";

type MiniprogramUploadOptions = Parameters<typeof miniprogramUpload>[0];

export type WechatUploadOptions = Pick<
  MiniprogramUploadOptions,
  "setting" | "onProgressUpdate" | "robot" | "threads"
>;

export type WechatUploadResult = Awaited<ReturnType<typeof miniprogramUpload>>;

export interface WechatConfig {
  env: string;
  appid: string;
  privateKey: string;
  project?: ProjectConfig;
  release?: ReleaseConfig;
  upload?: WechatUploadOptions;
}
