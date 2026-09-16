import type { WechatConfig } from "@mpc-plus/wechat";
import type { DouyinConfig } from "@mpc-plus/douyin";
import type { AlipayConfig } from "@mpc-plus/alipay";
import type { BaseMpcConfig } from "@mpc-plus/core";

export interface StandardPlatformsConfig {
  wechat?: WechatConfig[];
  douyin?: DouyinConfig[];
  alipay?: AlipayConfig[];
}

export type MPCConfig = BaseMpcConfig<StandardPlatformsConfig>;

export function defineConfig(config: MPCConfig): MPCConfig {
  return config;
}
