# MPC Plus

[简体中文](./README.md) | **English**

A unified CLI for uploading mini programs across platforms and environments, with shared configuration for build output, release information, and platform credentials.

WeChat and Douyin mini program uploads are supported. Douyin uploads use `tt-ide-cli` with token authentication.

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

## Changelog

The project uses the Conventional Commits preset from [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) to generate a shared [CHANGELOG.md](./CHANGELOG.md) from Git commits and version tags prefixed with `v`, including prereleases such as alpha versions.

```bash
vp install
vp run changelog
```

The command rebuilds and formats the entire changelog without duplicating releases on repeated runs. It includes `feat`, `fix`, `perf`, and breaking changes (`!` or `BREAKING CHANGE:`); ordinary `docs`, `chore`, and similar commits are hidden by default. Do not edit the generated file manually.

The `publish:packages` script automatically generates and writes `CHANGELOG.md` before uploading to npm. It also saves the full changelog and current version's release notes to `dist/release/CHANGELOG.md` and `dist/release/RELEASE_NOTES.md`. Publishing stops if generation fails, the root and published package versions differ, or the changelog lacks the current version.

Preview a release locally with the following command. It updates the changelog and checks the npm packages without uploading them:

```bash
vp run --no-cache publish:packages --dry-run
```

For a new release, commit features and fixes first, update the root, workspace, and lockfile versions together, then run the preview command above. Commit the version changes and changelog before creating and pushing the matching `v<version>` tag. You can also run `vp run changelog` independently. When the root version still matches the latest tag, only released versions are regenerated.

The tag publishing workflow fetches the full Git history and tags, generates the changelog, uses the current version's notes as the GitHub Release body, and attaches the complete `CHANGELOG.md`. CI-generated files are saved as an Actions artifact and in the Release, without committing back to a Git branch. Update the repository's changelog in the version commit before releasing.
