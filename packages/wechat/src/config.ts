import type {ProjectConfig, ReleaseConfig} from "@mpc-plus/core";

export interface WechatConfig{
  env: string;
  appid: string;
  privateKey: string;
  project?: ProjectConfig;
  release?: ReleaseConfig;
}
