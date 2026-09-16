import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { consola } from "consola";
import type { DouyinConfig, DouyinUploadResult } from "./config.ts";

const logger = consola.withTag("mpc:douyin");

export async function upload(config: DouyinConfig): Promise<DouyinUploadResult> {
  const projectPath = config.project?.root;
  const version = config.release?.version;
  const changeLog = config.release?.description;
  const missingFields = [
    !projectPath?.trim() && "project.root",
    !config.appid?.trim() && "appid",
    !config.token?.trim() && "token",
    !changeLog?.trim() && "release.description",
  ].filter(Boolean);

  try {
    if (!projectPath || !changeLog || missingFields.length > 0) {
      throw new Error(`缺少必填配置 ${missingFields.join(", ")}`);
    }

    if (version !== undefined && !/^\d+\.\d+\.\d+$/.test(version)) {
      throw new Error("release.version 必须为 x.y.z 格式，或省略以自动递增");
    }

    // The SDK reads the upload target from the project, not from setAppConfig.
    const projectConfig: { appid?: unknown } = JSON.parse(
      await readFile(join(projectPath, "project.config.json"), "utf8"),
    );
    if (projectConfig?.appid !== config.appid) {
      throw new Error("project.config.json 中的 appid 必须与抖音配置的 appid 一致");
    }

    logger.success(`配置校验: projectPath=${projectPath}, appid=已配置, token=已配置`);

    const { default: tma } = await import("tt-ide-cli");
    tma.setAppConfig({ appid: config.appid, config: { token: config.token } });
    logger.success("Token 配置: platform=douyin");
    logger.info(`上传执行: platform=douyin, version=${version ?? "自动递增"}`);

    return await tma.upload({
      ...config.upload,
      project: { path: projectPath },
      // The SDK types require a string; an empty value triggers its auto-increment logic.
      version: version ?? "",
      changeLog,
      qrcode: { format: null },
      copyToClipboard: false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const safeMessage = config.token ? message.split(config.token).join("[REDACTED]") : message;
    logger.error(`上传结果: platform=douyin, reason=${safeMessage}`);
    throw new Error(safeMessage);
  }
}
