import { createMPC } from '@mpc-plus/core'
import { wechatPlatform } from '@mpc-plus/wechat'
import type {MPC} from "@mpc-plus/core";
import type {MPCConfig, StandardPlatformsConfig} from "./config.ts";
import type {ProjectConfig, ReleaseConfig} from "@mpc-plus/core";

export type PlatformConfig<
    K extends keyof StandardPlatformsConfig
> = NonNullable<StandardPlatformsConfig[K]>[number]

export type ResolvedPlatformConfig<
    K extends keyof StandardPlatformsConfig
> =
    PlatformConfig<K> & {
    project: ProjectConfig
    release: ReleaseConfig
}

export function createStandardMPC(): MPC {
    const mpc = createMPC()
    mpc.register(wechatPlatform)
    return mpc
}

export function resolvePlatformConfig<K extends keyof StandardPlatformsConfig>(
    config: MPCConfig,
    platform: K,
    env: string
): ResolvedPlatformConfig<K> {
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