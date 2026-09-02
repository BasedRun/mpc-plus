import ci from "miniprogram-ci";
import { consola } from "consola";
import type { WechatConfig, WechatUploadResult } from "./config.ts";

const logger = consola.withTag("mpc:wechat");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function upload(config: WechatConfig): Promise<WechatUploadResult> {
  const projectPath = config.project?.root;
  const version = config.release?.version;

  const missingFields = [
    !projectPath && "project.root",
    !version && "release.version",
    !config.appid && "appid",
    !config.privateKey && "privateKey",
  ].filter(Boolean);

  if (!projectPath || !version || !config.appid || !config.privateKey) {
    const message = `缺少必填配置 ${missingFields.join(", ")}`;
    logger.error(`配置校验: ${message}`);
    throw new Error(message);
  }

  logger.success(
    `配置校验: projectPath=${projectPath}, version=${version}, appid=已配置, privateKey=已配置`,
  );

  const project = (() => {
    try {
      const value = new ci.Project({
        appid: config.appid,
        type: "miniProgram",
        projectPath,
        privateKey: config.privateKey,
        ignores: ["node_modules/**/*"],
      });

      logger.success(`项目初始化: projectPath=${projectPath}`);
      return value;
    } catch (error) {
      logger.error(`项目初始化: ${getErrorMessage(error)}`);
      throw error;
    }
  })();

  logger.info(`上传执行: platform=wechat, version=${version}`);

  try {
    const result = await ci.upload({
      ...config.upload,
      project,
      version,
      desc: config.release?.description,
    });

    return result;
  } catch (error) {
    logger.error(`上传结果: platform=wechat, reason=${getErrorMessage(error)}`);
    throw error;
  }
}
