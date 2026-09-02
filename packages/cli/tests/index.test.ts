import { expect, test } from "vite-plus/test";
import { resolveUploadTargets, uploadCommand } from "../src/commands/upload.ts";
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

test("resolves every configured environment when filters are omitted", () => {
  const config = defineConfig({
    platforms: {
      wechat: [
        { env: "dev", appid: "dev-appid", privateKey: "dev-key" },
        { env: "prod", appid: "prod-appid", privateKey: "prod-key" },
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
