import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { consola } from "consola";
import type { XhsConfig, XhsUploadResult } from "./config.ts";

const logger = consola.withTag("mpc:xhs");

export async function upload(config: XhsConfig): Promise<XhsUploadResult> {
  const projectPath = config.project?.root;
  const version = config.release?.version;
  const desc = config.release?.description;
  const missingFields = [
    !projectPath?.trim() && "project.root",
    !config.appid?.trim() && "appid",
    !config.token?.trim() && "token",
    !version?.trim() && "release.version",
    !desc?.trim() && "release.description",
  ].filter(Boolean);

  try {
    if (!projectPath || !version || !desc || missingFields.length > 0) {
      throw new Error(`缺少必填配置 ${missingFields.join(", ")}`);
    }

    const projectConfig: { appid?: unknown } = JSON.parse(
      await readFile(join(projectPath, "project.config.json"), "utf8"),
    );
    if (projectConfig?.appid !== config.appid) {
      throw new Error("project.config.json 中的 appid 必须与小红书配置的 appid 一致");
    }
    logger.success(`配置校验: projectPath=${projectPath}, appid=已配置, token=已配置`);

    // Each upload gets its own CI instance and explicitly sets its credentials.
    // The class comes from the pinned official CLI package.
    const { CI } = await import("xhs-mp-cli/dist/ci.js");
    const xmc = new CI();
    // The SDK may fall back to core.login when no usable token is found. Fail closed in CI.
    xmc.core.login = async () => {
      throw new Error("小红书上传仅支持 Token 认证，禁止扫码登录，请检查 token 和项目 appid");
    };
    xmc.setAppConfig({ appId: config.appid, config: { token: config.token } });
    logger.info(`上传执行: platform=xhs, version=${version}`);

    return await xmc.upload({
      project: { projectPath },
      version,
      desc,
      verbose: false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const safeMessage = config.token ? message.split(config.token).join("[REDACTED]") : message;
    logger.error(`上传结果: platform=xhs, reason=${safeMessage}`);
    throw new Error(safeMessage);
  }
}
