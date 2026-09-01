import {defineCommand, runMain} from "citty";
import {uploadCommand} from "./commands/upload.ts";
import packageJson from "../package.json" with {type: "json"};

const mpcCli = defineCommand({
    meta: {
        name: 'mpc',
        version: packageJson.version,
        description: 'miniprogram ci cli',
    },

    subCommands: {
        upload: uploadCommand
    }
})


export function RunMPC() {
    return runMain(mpcCli)
}
