import { defineCommand } from 'citty'
import {useCliContext} from "../context.ts";

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
        const { mpc, getConfig } = useCliContext()
        console.log(mpc.getPlatform('wechat'))

        const config = await getConfig()
        console.log(config)
    },
})