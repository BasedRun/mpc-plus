import { access, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { consola } from "consola";
import type { AlipayConfig, AlipayUploadResult } from "./config.ts";

const logger = consola.withTag("mpc:alipay");

export async function upload(config: AlipayConfig): Promise<AlipayUploadResult> {
  const projectPath = config.project?.root;
  const version = config.release?.version;
  const identityKeyPath = config.identityKeyPath;
  const missingFields = [
    !projectPath?.trim() && "project.root",
    !config.appid?.trim() && "appid",
    !identityKeyPath?.trim() && "identityKeyPath",
  ].filter(Boolean);

  try {
    if (!projectPath || missingFields.length > 0) {
      throw new Error(`缺少必填配置 ${missingFields.join(", ")}`);
    }
    if (version !== undefined && !/^\d+\.\d+\.\d+$/.test(version)) {
      throw new Error("release.version 必须为 x.y.z 格式，或省略以自动递增");
    }
    if (!(await stat(projectPath)).isDirectory()) {
      throw new Error("project.root 必须指向小程序项目目录");
    }
    await access(identityKeyPath, constants.R_OK);

    logger.success(`配置校验: projectPath=${projectPath}, appid=已配置, identityKeyPath=已配置`);

    // minidev is CommonJS: Node exposes its exports object as default, unlike its declarations.
    // Load it only for Alipay uploads because importing it initializes the SDK's local log directory.
    const sdk = (await import("minidev")).default as unknown as typeof import("minidev");
    logger.info(`上传执行: platform=alipay, version=${version ?? "自动递增"}`);

    return await sdk.minidev.upload({
      appId: config.appid,
      project: projectPath,
      identityKeyPath,
      clientType: "alipay",
      experience: config.upload?.experience ?? false,
      ...(version === undefined ? {} : { version }),
      ...(config.release?.description === undefined
        ? {}
        : { versionDescription: config.release.description }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`上传结果: platform=alipay, reason=${message}`);
    throw error;
  }
}
