import type { WechatConfig } from "@mpc-plus/wechat";
import type { DouyinConfig } from "@mpc-plus/douyin";
import type { BaseMpcConfig } from "@mpc-plus/core";

export interface StandardPlatformsConfig {
  wechat?: WechatConfig[];
  douyin?: DouyinConfig[];
}

export type MPCConfig = BaseMpcConfig<StandardPlatformsConfig>;

export function defineConfig(config: MPCConfig): MPCConfig {
  return config;
}
