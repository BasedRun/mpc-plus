import { resolve } from "node:path";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

const mocks = vi.hoisted(() => ({
  spawnSync: vi.fn(() => ({ status: 0, error: undefined as Error | undefined })),
  readFileSync: vi.fn<(path: string) => string>(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock("node:child_process", () => ({ spawnSync: mocks.spawnSync }));
vi.mock("node:fs", async (importOriginal) => ({
  ...(await importOriginal<typeof import("node:fs")>()),
  readFileSync: mocks.readFileSync,
  mkdirSync: mocks.mkdirSync,
  writeFileSync: mocks.writeFileSync,
}));

const rootDirectory = resolve(import.meta.dirname, "..");
const originalArgv = process.argv;
const currentNotes =
  "## [0.0.1-alpha.2](https://example.com/compare) (2026-09-16)\n\n### Features\n\n- New feature\n";
const changelog = `${currentNotes}\n## [0.0.1-alpha.1](https://example.com/old)\n\n- Old feature\n`;

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  process.argv = [process.execPath, resolve(rootDirectory, "scripts/publish.ts")];
  vi.stubEnv("GITHUB_REF_NAME", "v0.0.1-alpha.2");
  vi.spyOn(console, "log").mockImplementation(() => {});
  mocks.spawnSync.mockReturnValue({ status: 0, error: undefined });
  mocks.readFileSync.mockImplementation((path) =>
    path.endsWith("CHANGELOG.md")
      ? changelog
      : JSON.stringify({ name: "test-package", version: "0.0.1-alpha.2" }),
  );
});

afterEach(() => {
  process.argv = originalArgv;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

test("generates changelog before publishing and writes only the current version to release notes", async () => {
  await import("./publish.ts");

  expect(mocks.spawnSync).toHaveBeenCalledTimes(8);
  expect(mocks.spawnSync).toHaveBeenCalledWith(
    expect.any(String),
    expect.arrayContaining(["publish", resolve(rootDirectory, "packages/xhs")]),
    expect.any(Object),
  );
  expect(mocks.spawnSync).toHaveBeenCalledWith(
    expect.any(String),
    expect.arrayContaining(["publish", resolve(rootDirectory, "packages/alipay")]),
    expect.any(Object),
  );
  expect(mocks.spawnSync).toHaveBeenNthCalledWith(
    1,
    expect.any(String),
    ["exec", "--", "vp", "run", "changelog"],
    expect.any(Object),
  );
  expect(mocks.writeFileSync).toHaveBeenCalledWith(
    resolve(rootDirectory, "dist/release/CHANGELOG.md"),
    changelog,
  );
  expect(mocks.writeFileSync).toHaveBeenCalledWith(
    resolve(rootDirectory, "dist/release/RELEASE_NOTES.md"),
    currentNotes,
  );
  expect(mocks.writeFileSync.mock.invocationCallOrder[1]).toBeLessThan(
    mocks.spawnSync.mock.invocationCallOrder[1],
  );
});

test("dry run still generates files but every npm publish uses --dry-run", async () => {
  process.argv.push("--dry-run");
  await import("./publish.ts");

  expect(mocks.writeFileSync).toHaveBeenCalledTimes(2);
  for (const call of mocks.spawnSync.mock.calls.slice(1)) {
    expect(call).toEqual([
      expect.any(String),
      expect.arrayContaining(["publish", "--dry-run"]),
      expect.any(Object),
    ]);
  }
});

test("does not publish when changelog generation fails", async () => {
  mocks.spawnSync.mockReturnValue({ status: 7, error: undefined });
  vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`exit ${code}`);
  });

  await expect(import("./publish.ts")).rejects.toThrow("exit 7");
  expect(mocks.spawnSync).toHaveBeenCalledTimes(1);
  expect(mocks.writeFileSync).not.toHaveBeenCalled();
});

test("does not publish when the generated changelog lacks the current version", async () => {
  mocks.readFileSync.mockImplementation((path) =>
    path.endsWith("CHANGELOG.md")
      ? "## [0.0.1-alpha.1](https://example.com/old)\n"
      : JSON.stringify({ name: "test-package", version: "0.0.1-alpha.2" }),
  );

  await expect(import("./publish.ts")).rejects.toThrow("does not contain release notes");
  expect(mocks.spawnSync).toHaveBeenCalledTimes(1);
  expect(mocks.writeFileSync).not.toHaveBeenCalled();
});

test("rejects a root version mismatch before generating or publishing", async () => {
  mocks.readFileSync.mockImplementation((path) =>
    JSON.stringify({
      name: "test-package",
      version: path === resolve(rootDirectory, "package.json") ? "0.0.1-alpha.1" : "0.0.1-alpha.2",
    }),
  );

  await expect(import("./publish.ts")).rejects.toThrow("Root package version");
  expect(mocks.spawnSync).not.toHaveBeenCalled();
});

test("rejects a mismatched release tag before generating or publishing", async () => {
  vi.stubEnv("GITHUB_REF_NAME", "v0.0.1-alpha.1");

  await expect(import("./publish.ts")).rejects.toThrow("Git tag v0.0.1-alpha.1");
  expect(mocks.spawnSync).not.toHaveBeenCalled();
});
