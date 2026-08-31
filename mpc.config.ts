import { defineConfig } from "@mpc-plus/cli";

export default defineConfig({
  project: {
    root: './dist/build/mp-weixin',
  },

  release: {
    version: '1.0.0',
    description: 'Release v1.0.0',
  },

  platforms: {
    wechat: [
      {
        env: 'dev',
        appid: process.env.WECHAT_APPID ?? "",
        privateKey: process.env.WECHAT_PRIVATE_KEY ?? "",
      },
      {
        env: 'prod',
        appid: process.env.WECHAT_APPID ?? "",
        privateKey: process.env.WECHAT_PRIVATE_KEY ?? "",
      },
    ],
  },
})
