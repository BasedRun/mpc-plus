#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

interface PackageManifest {
  name: string;
  version: string;
}

interface ReleasePackage {
  packageDirectory: string;
  manifest: PackageManifest;
}

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const releasePackages = [
  "packages/core",
  "packages/douyin",
  "packages/wechat",
  "packages/standard",
  "packages/cli",
];
const supportedArguments = new Set(["--dry-run"]);
const unknownArguments = process.argv
  .slice(2)
  .filter((argument) => !supportedArguments.has(argument));

if (unknownArguments.length > 0) {
  throw new Error(`Unknown publish argument(s): ${unknownArguments.join(", ")}`);
}

const dryRun = process.argv.includes("--dry-run");
const manifests: ReleasePackage[] = releasePackages.map((packageDirectory) => {
  const manifestPath = resolve(rootDirectory, packageDirectory, "package.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as PackageManifest;

  return { packageDirectory, manifest };
});
const versions = new Set(manifests.map(({ manifest }) => manifest.version));

if (versions.size !== 1) {
  const packageVersions = manifests
    .map(({ manifest }) => `${manifest.name}@${manifest.version}`)
    .join(", ");
  throw new Error(`All published packages must use the same version: ${packageVersions}`);
}

const [version] = versions;
const releaseTag = process.env.GITHUB_REF_NAME;

if (releaseTag && releaseTag !== `v${version}`) {
  throw new Error(
    `Git tag ${releaseTag} does not match package version ${version}; expected v${version}`,
  );
}

const npmTag = version.includes("-") ? "next" : "latest";
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npmRegistry = "https://registry.npmjs.org";

console.log(`[publish] version=${version}, npmTag=${npmTag}, dryRun=${dryRun}`);

for (const { packageDirectory, manifest } of manifests) {
  console.log(`[publish] ${dryRun ? "checking" : "publishing"} ${manifest.name}@${version}`);

  const publishArguments = [
    "publish",
    resolve(rootDirectory, packageDirectory),
    "--access",
    "public",
    "--tag",
    npmTag,
    "--registry",
    npmRegistry,
  ];

  if (dryRun) {
    publishArguments.push("--dry-run");
  }

  const result = spawnSync(npmCommand, publishArguments, {
    cwd: rootDirectory,
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`[publish] ${dryRun ? "dry run complete" : "publish complete"}`);
