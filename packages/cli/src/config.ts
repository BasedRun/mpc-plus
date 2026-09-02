import { readdir } from "node:fs/promises";

const ConfigRe = /^mpc\.config\.(ts|js|mjs|cjs)$/;

import { resolve } from "node:path";
import { consola } from "consola";
import { createJiti } from "jiti";
import type { MPCConfig } from "@mpc-plus/standard";

const logger = consola.withTag("mpc");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function loadConfig(cwd = process.cwd()) {
  let files: string[];

  try {
    files = await readdir(cwd);
  } catch (error) {
    logger.error(`配置发现: ${getErrorMessage(error)}`);
    throw error;
  }

  const configFile = files.find((file) => ConfigRe.test(file));

  if (!configFile) {
    logger.error("配置发现: 未找到 mpc.config 配置文件");
    throw new Error("Cannot find mpc config file");
  }

  const configPath = resolve(cwd, configFile);

  logger.success(`配置发现: file=${configPath}`);

  try {
    const jiti = createJiti(import.meta.url);
    const module = await jiti.import(configPath);

    logger.success(`配置加载: file=${configFile}`);

    return (module as { default: MPCConfig }).default;
  } catch (error) {
    logger.error(`配置加载: ${getErrorMessage(error)}`);
    throw error;
  }
}
