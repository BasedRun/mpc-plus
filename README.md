# MPC Plus

**简体中文** | [English](./README.en.md)

面向多平台、多环境的小程序上传 CLI，通过统一配置管理构建产物、版本信息和平台凭据。

目前已实现微信小程序上传；抖音平台暂提供配置类型，尚未接入上传流程。

## 功能

- **统一配置**：使用 `mpc.config.ts` 集中管理项目、版本和各平台环境。
- **多环境上传**：通过 `--platform` 和 `--env` 筛选目标，支持一次上传多个配置环境。
- **环境变量**：根据 `--env` 加载对应的 `.env` 文件，配置中可直接读取 `process.env`。
- **执行反馈**：实时输出上传日志；单个目标失败后继续处理其余目标，并以非零退出码反馈失败。

## 快速开始

### 1. 安装

在小程序项目中安装 CLI：

```bash
npm install -D @mpc-plus/cli
npm exec -- mpc --help
```

### 2. 配置项目

先使用项目原有的构建命令生成小程序产物，再在项目根目录创建 `mpc.config.ts`：

```ts
import { defineConfig } from "@mpc-plus/cli";

export default defineConfig({
  project: {
    root: "./dist/build/mp-weixin",
  },
  release: {
    version: "1.0.0",
    description: "Release v1.0.0",
  },
  platforms: {
    wechat: [
      {
        env: "prod",
        appid: process.env.WX_APPID ?? "",
        privateKeyPath: process.env.WECHAT_PRIVATE_KEY_PATH ?? "",
      },
    ],
  },
});
```

将 `project.root` 改为实际构建产物目录，并在 `.env.prod` 中填写对应的小程序 AppID 和上传私钥路径：

```dotenv
WX_APPID=wx123
WECHAT_PRIVATE_KEY_PATH=/secure/private.wx.key
```

### 3. 上传

```bash
npm exec -- mpc upload --platform wechat --env prod
```

省略 `--platform` 和 `--env` 时，会依次上传配置中的全部平台和环境。需要加载 `.env.prod` 等环境专用文件时，应明确传入 `--env`。
