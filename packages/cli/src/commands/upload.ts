import { defineCommand } from "citty";
import { consola } from "consola";
import { useCliContext } from "../context.ts";
import type { MPCConfig, StandardPlatformsConfig } from "@mpc-plus/standard";

const logger = consola.withTag("mpc");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export interface UploadTarget {
  platform: keyof StandardPlatformsConfig;
  env: string;
}

export function resolveUploadTargets(
  config: MPCConfig,
  requestedPlatform?: string,
  requestedEnv?: string,
): UploadTarget[] {
  const platforms = requestedPlatform ? [requestedPlatform] : Object.keys(config.platforms ?? {});

  return platforms.flatMap((platform) => {
    const name = platform as keyof StandardPlatformsConfig;
    const platformConfigs = config.platforms?.[name] ?? [];
    const environments = platformConfigs
      .map((platformConfig) => platformConfig.env)
      .filter((env) => !requestedEnv || env === requestedEnv);

    return [...new Set(environments)].map((env) => ({ platform: name, env }));
  });
}

export const uploadCommand = defineCommand({
  meta: {
    name: "upload",
    description: "Upload mini program",
  },

  args: {
    platform: {
      type: "string",
      required: false,
      description: "Platform filter; uploads all configured platforms when omitted",
    },

    env: {
      type: "string",
      required: false,
      description: "Environment filter; uploads all configured environments when omitted",
    },
  },

  async run({ args }) {
    const requestedPlatform = args.platform ?? "all";
    const requestedEnv = args.env ?? "all";

    try {
      logger.success(`参数解析: env=${requestedEnv}, platform=${requestedPlatform}`);

      const { mpc, getConfig, resolveConfig } = useCliContext();

      const config = await getConfig();
      const targets = resolveUploadTargets(config, args.platform, args.env);

      if (targets.length === 0) {
        logger.error("平台分发: 配置中没有匹配的上传目标");
        throw new Error("No matching upload targets are configured.");
      }

      let hasFailures = false;

      for (const target of targets) {
        const { platform, env } = target;

        const resolvedConfig = await resolveConfig(platform, env).then(
          (value) => {
            logger.success(`环境解析: platform=${platform}, env=${env}`);
            return value;
          },
          (error: unknown) => {
            logger.error(
              `环境解析: platform=${platform}, env=${env}, reason=${getErrorMessage(error)}`,
            );
            hasFailures = true;
            return undefined;
          },
        );

        if (!resolvedConfig) {
          continue;
        }

        logger.success(`平台分发: platform=${platform}, env=${env}`);

        const platformStartedAt = Date.now();

        try {
          await mpc.upload(platform, resolvedConfig);
          logger.success(
            `上传结果: platform=${platform}, env=${env}, duration=${Date.now() - platformStartedAt}ms`,
          );
        } catch {
          hasFailures = true;
        }
      }

      if (hasFailures) {
        process.exitCode = 1;
      }
    } catch {
      process.exitCode = 1;
    }
  },
});
