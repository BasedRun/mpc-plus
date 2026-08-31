import {readdir} from "node:fs/promises";

const ConfigRe = /^mpc\.config\.(ts|js|mjs|cjs)$/

import {resolve} from "node:path";
import {createJiti} from "jiti";

export async function loadConfig(cwd = process.cwd()) {
    const files = await readdir(cwd)
    const configFile = files.find(file => ConfigRe.test(file));

    if (!configFile) {
        throw new Error('Cannot find mpc config file')
    }

    const configPath = resolve(cwd)

    const jiti = createJiti(import.meta.url)
    const module = await jiti.import(configPath)
    return (module as any)?.default
}
