# @mpc-plus/alipay

支付宝小程序上传平台，使用官方 `minidev` Node.js API。

导出 `alipayPlatform`、`AlipayConfig`、`AlipayUploadOptions` 和 `AlipayUploadResult`，由 `@mpc-plus/standard` 默认注册。

```ts
import type { AlipayConfig } from "@mpc-plus/alipay";

const config: AlipayConfig = {
  env: "prod",
  appid: "2026000000000000",
  identityKeyPath: "/path/to/identity.json",
  project: { root: "./dist/build/mp-alipay" },
  release: { description: "优化首页体验" },
  upload: { experience: false },
};
```

`appid`、`identityKeyPath`、`project.root` 上传时必填。`release.version` 可选，省略后由支付宝自动递增；填写时需使用 `x.y.z` 数字格式。`release.description` 映射为 `versionDescription`，`upload.experience` 默认 `false`。

通过统一 CLI 上传：

```bash
npm exec -- mpc upload --platform alipay --env prod
```

官方文档：[upload 上传项目](https://opendocs.alipay.com/mini/02q3an?pathHash=12060a6b)。
