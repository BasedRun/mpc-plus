import {defineCommand, runMain} from "citty";
import {uploadCommand} from "./commands/upload.ts";

const mpcCli = defineCommand({
    meta: {
        name: 'mpc',
        version: '0.0.1',
        description: 'miniprogram ci cli',
    },

    subCommands: {
        upload: uploadCommand
    }
})


export function RunMPC() {
    return runMain(mpcCli)
}