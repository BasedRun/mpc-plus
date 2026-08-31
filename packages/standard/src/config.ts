import type {WechatConfig} from '@mpc-plus/wechat'
import type {BaseMpcConfig} from "@mpc-plus/core";

export interface StandardPlatformsConfig {
  wechat?: WechatConfig[]
}

export type MPCConfig = BaseMpcConfig<StandardPlatformsConfig>

export function defineConfig(config: MPCConfig): MPCConfig {
  return config
}

export function resolvePlatformConfig<K extends keyof StandardPlatformsConfig>(
    config: MPCConfig,
    platform: K,
    env: string
) {
  const platformConfigs = config.platforms?.[platform]

  if (!platformConfigs) {
    throw new Error(`Platform ${platform} is not configured.`)
  }

  const  envConfig = platformConfigs.find(e => e.env === env)
  if (!envConfig) {
    throw new Error(`Environment ${platform} is not configured for ${platform}`)
  }

  return {
    ...envConfig,
    project: {
      ...config.project,
      ...envConfig.project,
    },

    release: {
      ...config.release,
      ...envConfig.release,
    }
  }
}