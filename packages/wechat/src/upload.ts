import ci from "miniprogram-ci";
import type {WechatConfig, WechatUploadResult} from "./config.ts";

export async function upload(config: WechatConfig): Promise<WechatUploadResult> {
  const projectPath = config.project?.root;
  const version = config.release?.version;

  if (!projectPath) {
    throw new Error("Wechat project root is required.");
  }

  if (!version) {
    throw new Error("Wechat release version is required.");
  }

  const project = new ci.Project({
    appid: config.appid,
    type: "miniProgram",
    projectPath,
    privateKey: config.privateKey,
    ignores: ["node_modules/**/*"],
  });

  return ci.upload({
    ...config.upload,
    project,
    version,
    desc: config.release?.description,
  });
}
