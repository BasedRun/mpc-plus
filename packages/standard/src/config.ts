import type {WechatConfig} from '@mpc-plus/wechat'
import type {BaseMpcConfig} from "@mpc-plus/core";

export interface StandardPlatformsConfig {
  wechat?: WechatConfig[]
}

export type MPCConfig = BaseMpcConfig<StandardPlatformsConfig>

export function defineConfig(config: MPCConfig): MPCConfig {
  return config
}