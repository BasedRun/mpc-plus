import { createStandardMPC, resolvePlatformConfig } from '@mpc-plus/standard'
import { loadConfig } from './config.ts'
import type { StandardPlatformsConfig } from "@mpc-plus/standard";

export function _createCliContext() {
    const cwd = process.cwd()

    const mpc = createStandardMPC()

    let config: Awaited<ReturnType<typeof loadConfig>> | undefined

    async function getConfig() {
        if (!config) {
            config = await loadConfig(cwd)
        }

        return config
    }

    async function resolveConfig<K extends keyof StandardPlatformsConfig>(platform: K, env: string) {
        const config = await getConfig()

        return resolvePlatformConfig(
            config,
            platform,
            env
        )
    }

    return {
        cwd,
        mpc,
        getConfig,
        resolveConfig,
    }
}

function createSingleton<T>(factory: () => T) {
    let instance: T | undefined

    return () => {
        if (!instance) {
            instance = factory()
        }

        return instance
    }
}

export const useCliContext = createSingleton(_createCliContext)
export type CliContext = ReturnType<typeof _createCliContext>