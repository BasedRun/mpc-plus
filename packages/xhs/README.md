# @mpc-plus/xhs

使用官方 `xhs-mp-cli` 上传小红书小程序，由 `@mpc-plus/standard` 默认注册。

导出 `xhsPlatform`、`XhsConfig` 和 `XhsUploadResult`。

```ts
import type { XhsConfig } from "@mpc-plus/xhs";

const config: XhsConfig = {
  env: "prod",
  appid: process.env.XHS_APPID ?? "",
  token: process.env.XHS_TOKEN ?? "",
  project: { root: "./dist/build/mp-xhs" },
  release: { version: "1.0.0", description: "优化首页体验" },
};
```

上传时上述字段均要求非空。版本号跟随 SDK，不增加格式限制，也不自动递增。
项目 `project.config.json` 的 `appid` 必须匹配配置。仅支持 Token 认证，SDK 的扫码登录回退会直接报错。

```bash
npm exec -- mpc upload --platform xhs --env prod
```

当前固定使用已核验的 `xhs-mp-cli@2.1.6`，适配其缺失的类型入口，并为每个上传目标创建独立 CI 实例。SDK 会将 Token 保存到本机配置存储中。
