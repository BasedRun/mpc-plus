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

## 更新日志

项目使用 [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) 的 Conventional Commits 预设，从 Git 提交和 `v` 前缀版本标签生成统一的 [CHANGELOG.md](./CHANGELOG.md)，包含 alpha 等预发布版本。

```bash
vp install
vp run changelog
```

该命令完整重建并格式化日志，重复执行不会追加重复的版本记录。日志包含 `feat`、`fix`、`perf` 及破坏性变更（`!` 或 `BREAKING CHANGE:`）；普通 `docs`、`chore` 等提交默认不展示。生成的文件不应手工编辑。

发布脚本 `publish:packages` 会在上传 npm 前自动生成并写入 `CHANGELOG.md`，同时将完整日志和当前版本说明分别保存到 `dist/release/CHANGELOG.md` 和 `dist/release/RELEASE_NOTES.md`。生成失败、根项目与发布包版本不一致，或日志缺少当前版本时会停止发布。

本地可执行以下命令预演发布；它会更新日志并检查 npm 包，但不会上传 npm：

```bash
vp run --no-cache publish:packages --dry-run
```

发布新版本时，先提交功能和修复，再统一更新根项目、工作区包及锁文件版本，运行上述预演命令，将版本号和日志一起提交，最后创建并推送对应的 `v<version>` 标签。也可以单独运行 `vp run changelog`。根项目版本仍等于最新标签时，仅重建已发布版本的日志。

标签发布工作流会拉取完整 Git 历史和标签，自动生成日志，使用当前版本说明作为 GitHub Release 正文，并附上完整的 `CHANGELOG.md`。CI 生成的文件保存在 Actions artifact 和 Release 中，不会自动提交回 Git 分支；仓库中的日志随发布前的版本提交更新。
