# MPC Plus

[简体中文](./README.md) | **English**

A unified CLI for uploading mini programs across platforms and environments, with shared configuration for build output, release information, and platform credentials.

WeChat mini program uploads are currently implemented. The Douyin package provides configuration types but is not yet connected to the upload workflow.

## Features

- **Unified configuration**: Manage projects, releases, and platform environments in `mpc.config.ts`.
- **Multiple environments**: Filter targets with `--platform` and `--env`, or upload to multiple configured environments in one run.
- **Environment variables**: Load `.env` files according to `--env` and read values through `process.env` in your configuration.
- **Execution feedback**: Stream upload logs, continue with remaining targets after a failure, and return a nonzero exit code if any target fails.

## Quick start

### 1. Install

Install the CLI in your mini program project:

```bash
npm install -D @mpc-plus/cli
npm exec -- mpc --help
```

### 2. Configure your project

Build your mini program using your project's existing build command, then create `mpc.config.ts` in the project root:

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

Set `project.root` to your build output directory, and add your mini program AppID and upload private key path to `.env.prod`:

```dotenv
WX_APPID=wx123
WECHAT_PRIVATE_KEY_PATH=/secure/private.wx.key
```

### 3. Upload

```bash
npm exec -- mpc upload --platform wechat --env prod
```

Omitting both `--platform` and `--env` uploads all configured platforms and environments in sequence. Pass `--env` explicitly to load environment-specific files such as `.env.prod`.
