import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { xhsPlatform, type XhsConfig } from "../src/index.ts";

const sdk = vi.hoisted(() => ({
  create: vi.fn(),
  setAppConfig: vi.fn(),
  upload: vi.fn(),
  login: vi.fn(),
}));
vi.mock("xhs-mp-cli/dist/ci.js", () => ({
  CI: class {
    core = { login: sdk.login };
    setAppConfig = sdk.setAppConfig;
    upload = sdk.upload;
    constructor() {
      sdk.create(this);
    }
  },
}));

let config: XhsConfig;
let projectPath: string;

beforeEach(async () => {
  vi.resetAllMocks();
  projectPath = await mkdtemp(join(tmpdir(), "mpc-xhs-"));
  await writeFile(join(projectPath, "project.config.json"), JSON.stringify({ appid: "xhs-test" }));
  config = {
    env: "prod",
    appid: "xhs-test",
    token: "secret-token",
    project: { root: projectPath },
    release: { version: "release-2026.09", description: "Update home page" },
  };
});

afterEach(async () => {
  await rm(projectPath, { recursive: true, force: true });
});

test("configures the token before uploading and passes non-semver versions unchanged", async () => {
  const original = structuredClone(config);
  sdk.upload.mockImplementation(() => {
    expect(sdk.setAppConfig).toHaveBeenCalledExactlyOnceWith({
      appId: "xhs-test",
      config: { token: "secret-token" },
    });
    return Promise.resolve(null);
  });
  expect(await xhsPlatform.upload(config)).toBeNull();
  expect(sdk.upload).toHaveBeenCalledExactlyOnceWith({
    project: { projectPath },
    version: "release-2026.09",
    desc: "Update home page",
    verbose: false,
  });
  expect(config).toEqual(original);
  expect(JSON.parse(await readFile(join(projectPath, "project.config.json"), "utf8"))).toEqual({
    appid: "xhs-test",
  });
  expect(sdk.login).not.toHaveBeenCalled();
});

test.each([
  ["project.root", { project: undefined }],
  ["appid", { appid: "" }],
  ["token", { token: "  " }],
  ["release.version", { release: { description: "Release" } }],
  ["release.version", { release: { version: "  ", description: "Release" } }],
  ["release.description", { release: { version: "1.0" } }],
  ["release.description", { release: { version: "1.0", description: "  " } }],
] satisfies [string, Partial<XhsConfig>][])(
  "rejects missing %s before initializing the SDK",
  async (field, override) => {
    await expect(xhsPlatform.upload({ ...config, ...override })).rejects.toThrow(field);
    expect(sdk.create).not.toHaveBeenCalled();
    expect(sdk.upload).not.toHaveBeenCalled();
    expect(sdk.login).not.toHaveBeenCalled();
  },
);

test("rejects a mismatched project AppID even if the SDK could have cached credentials", async () => {
  await writeFile(join(projectPath, "project.config.json"), JSON.stringify({ appid: "other-app" }));
  await expect(xhsPlatform.upload(config)).rejects.toThrow("appid 必须与小红书配置");
  expect(sdk.create).not.toHaveBeenCalled();
});

test("does not initialize the SDK or create project configuration when it is missing", async () => {
  await rm(join(projectPath, "project.config.json"));
  await expect(xhsPlatform.upload(config)).rejects.toThrow("project.config.json");
  expect(sdk.create).not.toHaveBeenCalled();
});

test("blocks the SDK's login fallback rather than starting QR authorization", async () => {
  sdk.upload.mockImplementation(() => sdk.create.mock.calls[0][0].core.login());
  await expect(xhsPlatform.upload(config)).rejects.toThrow("禁止扫码登录");
  expect(sdk.login).not.toHaveBeenCalled();
});

test("creates separate SDK instances for different environments", async () => {
  await xhsPlatform.upload(config);
  await xhsPlatform.upload({ ...config, env: "dev", token: "dev-token" });
  expect(sdk.create).toHaveBeenCalledTimes(2);
  expect(sdk.create.mock.calls[0][0]).not.toBe(sdk.create.mock.calls[1][0]);
  expect(sdk.setAppConfig).toHaveBeenNthCalledWith(2, {
    appId: config.appid,
    config: { token: "dev-token" },
  });
});

test("stops on credential configuration failure", async () => {
  sdk.setAppConfig.mockImplementation(() => {
    throw new Error("Cannot save credentials");
  });
  await expect(xhsPlatform.upload(config)).rejects.toThrow("Cannot save credentials");
  expect(sdk.upload).not.toHaveBeenCalled();
  expect(sdk.login).not.toHaveBeenCalled();
});

test("reports SDK upload failures with token redaction", async () => {
  sdk.upload.mockRejectedValue(new Error(`Upload rejected: ${config.token}`));
  await expect(xhsPlatform.upload(config)).rejects.toThrow("Upload rejected: [REDACTED]");
  expect(sdk.login).not.toHaveBeenCalled();
});
