import type { WechatConfig } from '@mpc-plus/wechat'

export interface MPCConfig {
  project?: {
    root?: string
  }

  release?: {
    version?: string
    description?: string
  }

  platforms?: {
    wechat?: WechatConfig[]
  }
}

export function defineConfig(config: MPCConfig): MPCConfig {
  return config
}