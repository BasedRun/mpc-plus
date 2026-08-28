import { defineConfig } from "@mcp/cli";

export default defineConfig({
  project: {
    root: ".",
  },
  release: {
    version: "package",
    description: "git",
  },
  platforms: {
    wechat: {
      appid: process.env.WECHAT_APPID ?? "",
      privateKey: process.env.WECHAT_PRIVATE_KEY ?? "",
      output: "./dist/mp-weixin",
    },
    douyin: {
      appid: process.env.DOUYIN_APPID ?? "",
      token: process.env.DOUYIN_TOKEN ?? "",
      output: "./dist/mp-toutiao",
    },
  },
});
