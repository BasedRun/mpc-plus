import { defineCommand } from 'citty'
import {useCliContext} from "../context.ts";
import type {StandardPlatformsConfig} from "@mpc-plus/standard";

export const uploadCommand = defineCommand({
    meta: {
        name: 'upload',
        description: 'Upload mini program',
    },

    args: {
        platform: {
            type: 'string',
            required: false,
            description: ''
        },

        env: {
            type: 'string',
            required: true,
            description: 'env'
        }
    },

    async run({args}) {
        const { mpc, getConfig, resolveConfig } = useCliContext()

        const config = await getConfig()

        const platforms = args.platform ? [args.platform ] : Object.keys(config.platforms ?? {})

        for (const platform of platforms) {
            const name = platform as keyof StandardPlatformsConfig

            const resolvedConfig = await resolveConfig(
                name,
                args.env,
            )

            await mpc.upload(
                name,
                resolvedConfig,
            )
        }
    },
})