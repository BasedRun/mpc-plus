import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { loadModeEnv, resolveUploadTargets, uploadCommand } from "../src/commands/upload.ts";
import { loadConfig } from "../src/config.ts";
import { defineConfig } from "../src/index.ts";

test("re-exports defineConfig without changing its value", () => {
  const config = defineConfig({ platforms: {} });

  expect(defineConfig(config)).toBe(config);
});

test("makes the environment argument optional", () => {
  expect(uploadCommand.args).toMatchObject({
    env: { required: false },
  });
});

test("includes XHS in all-target uploads and filters its environments", () => {
  const config = defineConfig({
    platforms: {
      alipay: [{ env: "prod", appid: "ali-prod", identityKeyPath: "/keys/alipay" }],
      xhs: [
        { env: "dev", appid: "xhs-dev", token: "dev-token" },
        { env: "prod", appid: "xhs-prod", token: "prod-token" },
      ],
    },
  });
  expect(resolveUploadTargets(config)).toEqual([
    { platform: "alipay", env: "prod" },
    { platform: "xhs", env: "dev" },
    { platform: "xhs", env: "prod" },
  ]);
  expect(resolveUploadTargets(config, "xhs")).toEqual([
    { platform: "xhs", env: "dev" },
    { platform: "xhs", env: "prod" },
  ]);
  expect(resolveUploadTargets(config, "xhs", "prod")).toEqual([{ platform: "xhs", env: "prod" }]);
  expect(resolveUploadTargets(config, "xhs", "missing")).toEqual([]);
});

test("includes Alipay in all-target uploads and filters its environments", () => {
  const config = defineConfig({
    platforms: {
      wechat: [{ env: "prod", appid: "wx-prod", privateKeyPath: "/keys/wechat" }],
      douyin: [{ env: "prod", appid: "tt-prod", token: "token" }],
      alipay: [
        { env: "dev", appid: "ali-dev", identityKeyPath: "/keys/dev" },
        { env: "prod", appid: "ali-prod", identityKeyPath: "/keys/prod" },
      ],
    },
  });
  expect(resolveUploadTargets(config)).toEqual([
    { platform: "wechat", env: "prod" },
    { platform: "douyin", env: "prod" },
    { platform: "alipay", env: "dev" },
    { platform: "alipay", env: "prod" },
  ]);
  expect(resolveUploadTargets(config, "alipay")).toEqual([
    { platform: "alipay", env: "dev" },
    { platform: "alipay", env: "prod" },
  ]);
  expect(resolveUploadTargets(config, "alipay", "prod")).toEqual([
    { platform: "alipay", env: "prod" },
  ]);
  expect(resolveUploadTargets(config, "alipay", "missing")).toEqual([]);
});

test("loads Vite env files before evaluating the config", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "mpc-plus-env-"));
  const appidName = "MPC_PLUS_TEST_WX_APPID";
  const privateKeyPathName = "MPC_PLUS_TEST_PRIVATE_KEY_PATH";
  const previousAppid = process.env[appidName];
  const previousPrivateKeyPath = process.env[privateKeyPathName];

  delete process.env[appidName];
  delete process.env[privateKeyPathName];

  try {
    await writeFile(join(cwd, ".env"), `${appidName}=base\n${privateKeyPathName}=base-key\n`);
    await writeFile(join(cwd, ".env.local"), `${privateKeyPathName}=local-key\n`);
    await writeFile(join(cwd, ".env.dev"), `${appidName}=dev-appid\n`);
    await writeFile(
      join(cwd, "mpc.config.mjs"),
      `export default {
        platforms: {
          wechat: [{
            env: "dev",
            appid: process.env.${appidName},
            privateKeyPath: process.env.${privateKeyPathName},
          }],
        },
      };`,
    );

    loadModeEnv("dev", cwd);
    const config = await loadConfig(cwd);
    const environment = config.platforms?.wechat?.[0];

    expect(environment).toMatchObject({
      appid: "dev-appid",
      privateKeyPath: "local-key",
    });
  } finally {
    if (previousAppid === undefined) {
      delete process.env[appidName];
    } else {
      process.env[appidName] = previousAppid;
    }

    if (previousPrivateKeyPath === undefined) {
      delete process.env[privateKeyPathName];
    } else {
      process.env[privateKeyPathName] = previousPrivateKeyPath;
    }

    await rm(cwd, { recursive: true, force: true });
  }
});

test("resolves every configured environment when filters are omitted", () => {
  const config = defineConfig({
    platforms: {
      wechat: [
        {
          env: "dev",
          appid: "dev-appid",
          privateKeyPath: "/path/to/dev-key",
        },
        {
          env: "prod",
          appid: "prod-appid",
          privateKeyPath: "/path/to/prod-key",
        },
      ],
    },
  });

  expect(resolveUploadTargets(config)).toEqual([
    { platform: "wechat", env: "dev" },
    { platform: "wechat", env: "prod" },
  ]);
  expect(resolveUploadTargets(config, undefined, "prod")).toEqual([
    { platform: "wechat", env: "prod" },
  ]);
});

test("filters Douyin targets independently of WeChat environments", () => {
  const config = defineConfig({
    platforms: {
      wechat: [{ env: "prod", appid: "wx-prod", privateKeyPath: "/keys/wechat" }],
      douyin: [
        { env: "dev", appid: "tt-dev", token: "dev-token" },
        { env: "prod", appid: "tt-prod", token: "prod-token" },
      ],
    },
  });

  expect(resolveUploadTargets(config)).toEqual([
    { platform: "wechat", env: "prod" },
    { platform: "douyin", env: "dev" },
    { platform: "douyin", env: "prod" },
  ]);
  expect(resolveUploadTargets(config, "douyin")).toEqual([
    { platform: "douyin", env: "dev" },
    { platform: "douyin", env: "prod" },
  ]);
  expect(resolveUploadTargets(config, "douyin", "prod")).toEqual([
    { platform: "douyin", env: "prod" },
  ]);
  expect(resolveUploadTargets(config, undefined, "prod")).toEqual([
    { platform: "wechat", env: "prod" },
    { platform: "douyin", env: "prod" },
  ]);
  expect(resolveUploadTargets(config, "douyin", "missing")).toEqual([]);
});
