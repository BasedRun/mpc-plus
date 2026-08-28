import type { MpcConfigInput, PlatformDefinition } from "@mcp/core";
import type { DouyinConfigInput } from "@mcp/douyin";
import type { WechatConfigInput } from "@mcp/wechat";

export type StandardPlatformRegistry = {
  wechat: PlatformDefinition<"wechat", WechatConfigInput>;
  douyin: PlatformDefinition<"douyin", DouyinConfigInput>;
};

export type StandardConfigInput = MpcConfigInput<StandardPlatformRegistry>;

export function defineConfig<const Config extends StandardConfigInput>(config: Config): Config {
  return config;
}
