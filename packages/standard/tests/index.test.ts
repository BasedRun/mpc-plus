import { expect, expectTypeOf, test } from "vite-plus/test";
import { defineConfig, resolvePlatformConfig, type MPCConfig } from "../src/index.ts";

test("defineConfig preserves the standard configuration", () => {
  const config = defineConfig({
    platforms: {
      wechat: [
        {
          env: "production",
          appid: "appid",
          privateKeyPath: "/path/to/private-key",
        },
      ],
    },
  });

  expect(defineConfig(config)).toBe(config);
  expectTypeOf(config).toMatchTypeOf<MPCConfig>();
});

test("resolves Douyin environments with shared defaults and per-field overrides", () => {
  const config = defineConfig({
    project: { root: "/dist/shared" },
    release: { version: "1.2.3", description: "Shared release" },
    platforms: {
      douyin: [
        { env: "dev", appid: "tt-dev", token: "dev-token" },
        {
          env: "prod",
          appid: "tt-prod",
          token: "prod-token",
          project: { root: "/dist/mp-toutiao" },
          release: { description: "Production release" },
          upload: { channel: "2", needUploadSourcemap: false },
        },
      ],
    },
  });

  const original = structuredClone(config);
  expect(resolvePlatformConfig(config, "douyin", "dev")).toEqual({
    env: "dev",
    appid: "tt-dev",
    token: "dev-token",
    project: { root: "/dist/shared" },
    release: { version: "1.2.3", description: "Shared release" },
  });
  expect(resolvePlatformConfig(config, "douyin", "prod")).toEqual({
    env: "prod",
    appid: "tt-prod",
    token: "prod-token",
    project: { root: "/dist/mp-toutiao" },
    release: { version: "1.2.3", description: "Production release" },
    upload: { channel: "2", needUploadSourcemap: false },
  });
  expect(config).toEqual(original);
});

test("reports missing Douyin platforms and environments", () => {
  expect(() => resolvePlatformConfig({}, "douyin", "prod")).toThrow(
    "Platform douyin is not configured.",
  );
  expect(() => resolvePlatformConfig({ platforms: { douyin: [] } }, "douyin", "prod")).toThrow(
    "Environment prod is not configured for douyin",
  );
});
