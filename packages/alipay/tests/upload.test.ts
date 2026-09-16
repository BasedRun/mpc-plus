import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { alipayPlatform, type AlipayConfig } from "../src/index.ts";

const sdk = vi.hoisted(() => ({ upload: vi.fn() }));
// Match the real CommonJS exports object returned as default by Node's dynamic import.
vi.mock("minidev", () => ({ default: { minidev: sdk } }));

let projectPath: string;
let config: AlipayConfig;

beforeEach(async () => {
  vi.resetAllMocks();
  projectPath = await mkdtemp(join(tmpdir(), "mpc-alipay-"));
  const identityKeyPath = join(projectPath, "identity.json");
  await writeFile(identityKeyPath, "{}");
  config = {
    env: "prod",
    appid: "2026000000000000",
    identityKeyPath,
    project: { root: projectPath },
    release: { version: "1.2.3", description: "Update home page" },
    upload: { experience: true },
  };
});

afterEach(async () => {
  await rm(projectPath, { recursive: true, force: true });
});

test("maps configuration to the SDK and returns the uploaded version and experience URL", async () => {
  const result = { version: "1.2.3", experienceQrCodeUrl: "https://example.com/qr" };
  sdk.upload.mockResolvedValue(result);
  const original = structuredClone(config);

  expect(await alipayPlatform.upload(config)).toBe(result);
  expect(sdk.upload).toHaveBeenCalledExactlyOnceWith({
    appId: config.appid,
    project: projectPath,
    identityKeyPath: config.identityKeyPath,
    clientType: "alipay",
    version: "1.2.3",
    versionDescription: "Update home page",
    experience: true,
  });
  expect(config).toEqual(original);
});

test("omits version and description when release is absent and defaults experience to false", async () => {
  delete config.release;
  delete config.upload;
  sdk.upload.mockResolvedValue({ version: "1.2.4" });

  expect(await alipayPlatform.upload(config)).toEqual({ version: "1.2.4" });
  expect(sdk.upload).toHaveBeenCalledExactlyOnceWith({
    appId: config.appid,
    project: projectPath,
    identityKeyPath: config.identityKeyPath,
    clientType: "alipay",
    experience: false,
  });
});

test("allows a description without a version and preserves experience false", async () => {
  config.release = { description: "Automatic version" };
  config.upload = { experience: false };
  await alipayPlatform.upload(config);
  expect(sdk.upload).toHaveBeenCalledWith(
    expect.objectContaining({
      experience: false,
      versionDescription: "Automatic version",
    }),
  );
  expect(sdk.upload.mock.calls[0][0]).not.toHaveProperty("version");
});

test.each([
  ["project.root", { project: undefined }],
  ["project.root", { project: { root: "  " } }],
  ["appid", { appid: "" }],
  ["appid", { appid: "  " }],
  ["identityKeyPath", { identityKeyPath: "" }],
  ["identityKeyPath", { identityKeyPath: "  " }],
] satisfies [string, Partial<AlipayConfig>][])(
  "rejects missing %s before calling the SDK",
  async (field, override) => {
    await expect(alipayPlatform.upload({ ...config, ...override })).rejects.toThrow(field);
    expect(sdk.upload).not.toHaveBeenCalled();
  },
);

test.each(["", "1.2", "v1.2.3", "1.2.3-beta", " 1.2.3"])(
  "rejects invalid version %s",
  async (version) => {
    config.release = { version };
    await expect(alipayPlatform.upload(config)).rejects.toThrow("release.version");
    expect(sdk.upload).not.toHaveBeenCalled();
  },
);

test("rejects a project path pointing to a file", async () => {
  config.project = { root: config.identityKeyPath };
  await expect(alipayPlatform.upload(config)).rejects.toThrow("project.root");
  expect(sdk.upload).not.toHaveBeenCalled();
});

test("rejects a missing identity file instead of falling back to local authorization", async () => {
  await rm(config.identityKeyPath);
  await expect(alipayPlatform.upload(config)).rejects.toThrow("identity.json");
  expect(sdk.upload).not.toHaveBeenCalled();
});

test("ignores unexposed SDK options that could override the configured target or delete a version", async () => {
  Object.assign(config.upload!, {
    appId: "other",
    version: "9.9.9",
    clientType: "dingtalk",
    deleteVersion: "1.0.0",
  });
  await alipayPlatform.upload(config);
  expect(sdk.upload.mock.calls[0][0]).toMatchObject({
    appId: config.appid,
    version: "1.2.3",
    clientType: "alipay",
  });
  expect(sdk.upload.mock.calls[0][0]).not.toHaveProperty("deleteVersion");
});

test("propagates SDK upload failures", async () => {
  const error = new Error("Upload rejected");
  sdk.upload.mockRejectedValue(error);
  await expect(alipayPlatform.upload(config)).rejects.toBe(error);
});
