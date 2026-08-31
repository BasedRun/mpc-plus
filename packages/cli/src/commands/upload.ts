import { defineCommand } from 'citty'

import { loadConfig } from '../config.ts'

export const uploadCommand = defineCommand({
    meta: {
        name: 'upload',
        description: 'Upload mini program',
    },

    async run() {
        const config = await loadConfig()

        console.log(config)
    },
})