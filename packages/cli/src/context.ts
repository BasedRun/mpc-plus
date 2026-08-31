import { createStandardMPC } from '@mpc-plus/standard'
import { loadConfig } from './config.ts'

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

    return {
        cwd,
        mpc,
        getConfig
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