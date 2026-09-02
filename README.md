# MPC Plus

A unified CLI for uploading mini programs across platforms and environments.

## Development

- Check everything is ready:

```bash
vp run ready
```

- Run the tests:

```bash
vp run -r test
```

- Build the monorepo:

```bash
vp run -r build
```

- Run the development server:

```bash
vp run dev
```

This starts the documentation site. The same task can be run explicitly with:

```bash
vp run docs:dev
```

## Documentation

The Fumadocs site lives in the `docs` workspace and shares the root Vite+ installation.

```bash
vp install
vp run docs:check
vp run docs:build
```

## Publishing

All public packages use one version. Update the versions in `packages/core`, `packages/douyin`,
`packages/wechat`, `packages/standard`, and `packages/cli`, commit the change, and push a matching
`v<version>` tag. For example, version `0.1.0` must be released from tag `v0.1.0`.

The tag starts `.github/workflows/publish.yml`, which tests, builds, and publishes the packages to
npm in dependency order. Configure an npm granular access token as the `NPM_TOKEN` repository secret
before the first release.

Inspect the packages without uploading them:

```bash
npm run publish:packages -- --dry-run
```
