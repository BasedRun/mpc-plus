import { expect, expectTypeOf, test, vi } from "vite-plus/test";
import { douyinPlatform } from "@mpc-plus/douyin";
import { alipayPlatform } from "@mpc-plus/alipay";
import { xhsPlatform } from "@mpc-plus/xhs";
import {
  createStandardMPC,
  defineConfig,
  resolvePlatformConfig,
  type MPCConfig,
} from "../src/index.ts";

test("resolves XHS environment overrides and dispatches to its registered uploader", async () => {
  const config = defineConfig({
    project: { root: "/dist/shared" },
    release: { version: "release-2026.09", description: "Shared release" },
    platforms: {
      xhs: [
        { env: "dev", appid: "xhs-dev", token: "dev-token" },
        {
          env: "prod",
          appid: "xhs-prod",
          token: "prod-token",
          project: { root: "/dist/xhs" },
          release: { description: "Production release" },
        },
      ],
    },
  });
  const original = structuredClone(config);
  expect(resolvePlatformConfig(config, "xhs", "dev")).toEqual({
    env: "dev",
    appid: "xhs-dev",
    token: "dev-token",
    project: { root: "/dist/shared" },
    release: { version: "release-2026.09", description: "Shared release" },
  });
  const resolved = resolvePlatformConfig(config, "xhs", "prod");
  expect(resolved).toEqual({
    env: "prod",
    appid: "xhs-prod",
    token: "prod-token",
    project: { root: "/dist/xhs" },
    release: { version: "release-2026.09", description: "Production release" },
  });
  expect(config).toEqual(original);
  const mpc = createStandardMPC();
  const upload = vi.spyOn(xhsPlatform, "upload").mockResolvedValue(null);
  try {
    expect(mpc.hasPlatform("xhs")).toBe(true);
    expect(await mpc.upload("xhs", resolved)).toBeNull();
    expect(upload).toHaveBeenCalledExactlyOnceWith(resolved);
  } finally {
    upload.mockRestore();
  }
  expect(() => resolvePlatformConfig({}, "xhs", "prod")).toThrow("Platform xhs is not configured.");
  expect(() => resolvePlatformConfig(config, "xhs", "missing")).toThrow(
    "Environment missing is not configured for xhs",
  );
});

test("resolves Alipay environment overrides and dispatches uploads without a version", async () => {
  const config = defineConfig({
    project: { root: "/dist/shared" },
    release: { description: "Shared description" },
    platforms: {
      alipay: [
        { env: "dev", appid: "dev-app", identityKeyPath: "/keys/dev" },
        {
          env: "prod",
          appid: "prod-app",
          identityKeyPath: "/keys/prod",
          project: { root: "/dist/alipay" },
          release: { description: "Production" },
          upload: { experience: true },
        },
      ],
    },
  });
  const original = structuredClone(config);
  expect(resolvePlatformConfig(config, "alipay", "dev")).toEqual({
    env: "dev",
    appid: "dev-app",
    identityKeyPath: "/keys/dev",
    project: { root: "/dist/shared" },
    release: { description: "Shared description" },
  });
  const resolved = resolvePlatformConfig(config, "alipay", "prod");
  expect(resolved).toEqual({
    env: "prod",
    appid: "prod-app",
    identityKeyPath: "/keys/prod",
    project: { root: "/dist/alipay" },
    release: { description: "Production" },
    upload: { experience: true },
  });
  expect(config).toEqual(original);

  const mpc = createStandardMPC();
  const upload = vi.spyOn(alipayPlatform, "upload").mockResolvedValue({ version: "1.2.4" });
  try {
    expect(mpc.hasPlatform("alipay")).toBe(true);
    expect(await mpc.upload("alipay", resolved)).toEqual({ version: "1.2.4" });
    expect(upload).toHaveBeenCalledExactlyOnceWith(resolved);
  } finally {
    upload.mockRestore();
  }
});

test("inherits or overrides the shared Alipay version and reports unmatched environments", () => {
  const config = defineConfig({
    release: { version: "1.2.3" },
    platforms: {
      alipay: [
        { env: "dev", appid: "dev-app", identityKeyPath: "/keys/dev" },
        {
          env: "prod",
          appid: "prod-app",
          identityKeyPath: "/keys/prod",
          release: { version: "2.0.0" },
        },
        {
          env: "auto",
          appid: "auto-app",
          identityKeyPath: "/keys/auto",
          release: { version: undefined },
        },
      ],
    },
  });
  expect(resolvePlatformConfig(config, "alipay", "dev").release.version).toBe("1.2.3");
  expect(resolvePlatformConfig(config, "alipay", "prod").release.version).toBe("2.0.0");
  expect(resolvePlatformConfig(config, "alipay", "auto").release.version).toBeUndefined();
  expect(() => resolvePlatformConfig({}, "alipay", "prod")).toThrow(
    "Platform alipay is not configured.",
  );
  expect(() => resolvePlatformConfig(config, "alipay", "missing")).toThrow(
    "Environment missing is not configured for alipay",
  );
});

test("registers Douyin and dispatches resolved configuration to its uploader", async () => {
  const mpc = createStandardMPC();
  const config = resolvePlatformConfig(
    {
      project: { root: "/dist/douyin" },
      release: { version: "1.2.3", description: "Release" },
      platforms: { douyin: [{ env: "prod", appid: "tt-prod", token: "prod-token" }] },
    },
    "douyin",
    "prod",
  );
  const upload = vi.spyOn(douyinPlatform, "upload").mockResolvedValue("uploaded");
  try {
    expect(mpc.hasPlatform("wechat")).toBe(true);
    expect(mpc.hasPlatform("douyin")).toBe(true);
    expect(await mpc.upload("douyin", config)).toBe("uploaded");
    expect(upload).toHaveBeenCalledExactlyOnceWith(config);
  } finally {
    upload.mockRestore();
  }
});

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
