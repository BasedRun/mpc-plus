import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import type { DouyinConfig } from "../src/index.ts";
import { douyinPlatform } from "../src/index.ts";

const sdk = vi.hoisted(() => ({ setAppConfig: vi.fn(), upload: vi.fn() }));
vi.mock("tt-ide-cli", () => ({ default: sdk }));

let config: DouyinConfig;
let projectPath: string;

beforeEach(async () => {
  vi.resetAllMocks();
  projectPath = await mkdtemp(join(tmpdir(), "mpc-douyin-"));
  await writeFile(join(projectPath, "project.config.json"), JSON.stringify({ appid: "tt-test" }));
  config = {
    env: "prod",
    appid: "tt-test",
    token: "test-secret-token",
    project: { root: projectPath },
    release: { version: "1.2.3", description: "Fix home page" },
    upload: { channel: "2", needUploadSourcemap: false },
  };
});

afterEach(async () => {
  await rm(projectPath, { recursive: true, force: true });
});

test("configures the token before uploading and returns the SDK result", async () => {
  const result = { shortUrl: "https://example.com/preview", useCache: false };
  sdk.upload.mockImplementation(() => {
    expect(sdk.setAppConfig).toHaveBeenCalledExactlyOnceWith({
      appid: "tt-test",
      config: { token: "test-secret-token" },
    });
    return Promise.resolve(result);
  });
  const original = structuredClone(config);

  expect(await douyinPlatform.upload(config)).toBe(result);
  expect(sdk.upload).toHaveBeenCalledExactlyOnceWith({
    project: { path: projectPath },
    version: "1.2.3",
    changeLog: "Fix home page",
    channel: "2",
    needUploadSourcemap: false,
    qrcode: { format: null },
    copyToClipboard: false,
  });
  expect(config).toEqual(original);
  expect(JSON.parse(await readFile(join(projectPath, "project.config.json"), "utf8"))).toEqual({
    appid: "tt-test",
  });
});

test("allows the SDK to auto-increment the version and use its default upload options", async () => {
  config.release = { description: "Automatic version" };
  delete config.upload;

  await douyinPlatform.upload(config);

  expect(sdk.upload).toHaveBeenCalledWith({
    project: { path: projectPath },
    version: "",
    changeLog: "Automatic version",
    qrcode: { format: null },
    copyToClipboard: false,
  });
});

test.each([
  ["project.root", { project: undefined }],
  ["appid", { appid: "" }],
  ["token", { token: "  " }],
  ["release.description", { release: undefined }],
  ["release.description", { release: { description: "  " } }],
] satisfies [string, Partial<DouyinConfig>][])(
  "rejects missing %s before calling the SDK",
  async (field, override) => {
    await expect(douyinPlatform.upload({ ...config, ...override })).rejects.toThrow(field);
    expect(sdk.setAppConfig).not.toHaveBeenCalled();
    expect(sdk.upload).not.toHaveBeenCalled();
  },
);

test.each(["", "1.2", "1.2.3-beta", " 1.2.3"])("rejects invalid version %s", async (version) => {
  config.release = { version, description: "Release" };
  await expect(douyinPlatform.upload(config)).rejects.toThrow("release.version");
  expect(sdk.setAppConfig).not.toHaveBeenCalled();
  expect(sdk.upload).not.toHaveBeenCalled();
});

test("rejects a mismatched project appid before configuring credentials", async () => {
  await writeFile(join(projectPath, "project.config.json"), JSON.stringify({ appid: "tt-other" }));
  await expect(douyinPlatform.upload(config)).rejects.toThrow("appid 必须与抖音配置");
  expect(sdk.setAppConfig).not.toHaveBeenCalled();
  expect(sdk.upload).not.toHaveBeenCalled();
});

test("reports unreadable project configuration before configuring credentials", async () => {
  await rm(join(projectPath, "project.config.json"));
  await expect(douyinPlatform.upload(config)).rejects.toThrow("project.config.json");
  expect(sdk.setAppConfig).not.toHaveBeenCalled();
  expect(sdk.upload).not.toHaveBeenCalled();
});

test("stops if token configuration fails", async () => {
  sdk.setAppConfig.mockImplementation(() => {
    throw new Error("Cannot write app config");
  });
  await expect(douyinPlatform.upload(config)).rejects.toThrow("Cannot write app config");
  expect(sdk.upload).not.toHaveBeenCalled();
});

test("propagates upload failures without exposing the token", async () => {
  sdk.upload.mockRejectedValue(new Error(`Authentication failed: ${config.token}`));
  await expect(douyinPlatform.upload(config)).rejects.toThrow("Authentication failed: [REDACTED]");
});
