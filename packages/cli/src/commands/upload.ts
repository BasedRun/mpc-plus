import { defineCommand } from "citty";
import { consola } from "consola";
import { useCliContext } from "../context.ts";
import type { StandardPlatformsConfig } from "@mpc-plus/standard";

const logger = consola.withTag("mpc");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
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
      description: "",
    },

    env: {
      type: "string",
      required: true,
      description: "env",
    },
  },

  async run({ args }) {
    const requestedPlatform = args.platform ?? "all";

    try {
      logger.success(`参数解析: env=${args.env}, platform=${requestedPlatform}`);

      const { mpc, getConfig, resolveConfig } = useCliContext();

      const config = await getConfig();

      const platforms = args.platform ? [args.platform] : Object.keys(config.platforms ?? {});

      if (platforms.length === 0) {
        logger.error("平台分发: 没有配置可上传的平台");
        throw new Error("No upload platforms are configured.");
      }

      for (const platform of platforms) {
        const name = platform as keyof StandardPlatformsConfig;

        const resolvedConfig = await resolveConfig(name, args.env).then(
          (value) => {
            logger.success(`环境解析: platform=${name}, env=${args.env}`);
            return value;
          },
          (error: unknown) => {
            logger.error(
              `环境解析: platform=${name}, env=${args.env}, reason=${getErrorMessage(error)}`,
            );
            throw error;
          },
        );

        logger.success(`平台分发: platform=${name}`);

        const platformStartedAt = Date.now();
        await mpc.upload(name, resolvedConfig);
        logger.success(`上传结果: platform=${name}, duration=${Date.now() - platformStartedAt}ms`);
      }
    } catch {
      process.exitCode = 1;
    }
  },
});
