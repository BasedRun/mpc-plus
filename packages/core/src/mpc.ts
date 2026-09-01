import type {Platform} from "./platform.ts";

export function createMPC() {
    const platforms = new Map<string, Platform>()

    function register(platform: Platform) {
        platforms.set(platform.name, platform)
    }

    function hasPlatform(name: string) {
        const platform = platforms.get(name)
        return !!platform
    }

    function getPlatform(name: string) {
        const platform = platforms.get(name)
        if (!platform) {
            throw new Error(`Platform: ${name} is not registered`)
        }

        return platform
    }

    function upload<T>(name: string, options: T) {
        const platform = getPlatform(name)

        return platform.upload(options)
    }

    return {
        register,
        hasPlatform,
        getPlatform,

        upload
    }
}

export type MPC = ReturnType<typeof createMPC>