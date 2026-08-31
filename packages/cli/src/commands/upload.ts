import { defineCommand } from 'citty'
import {useCliContext} from "../context.ts";

export const uploadCommand = defineCommand({
    meta: {
        name: 'upload',
        description: 'Upload mini program',
    },

    async run() {
        const { mpc, getConfig } = useCliContext()
        console.log(mpc.getPlatform('wechat'))

        const config = await getConfig()
        console.log(config)
    },
})