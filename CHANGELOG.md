## [0.0.1-alpha.2](https://github.com/pkc918/mpc-plus/compare/v0.0.1-alpha.1...v0.0.1-alpha.2) (2026-09-16)

### Features

- **douyin:** add typed platform configuration ([817fd31](https://github.com/pkc918/mpc-plus/commit/817fd3146e9f08c38f822bcd6544fa3a0a49b368))

## [0.0.1-alpha.1](https://github.com/pkc918/mpc-plus/compare/7d49430df23b780dd148e2bf74ebcdf7c86d5f8e...v0.0.1-alpha.1) (2026-09-08)

### ⚠ BREAKING CHANGES

- **wechat:** rename the WeChat privateKey config field to privateKeyPath.

### Features

- **cli:** add executable entry and fix config loading ([1c842d3](https://github.com/pkc918/mpc-plus/commit/1c842d362b85eb63792934768953929d564eac8c))
- **cli:** add shared CLI context ([28e370d](https://github.com/pkc918/mpc-plus/commit/28e370d36b29bb1ce34ab37de6955e68b8667151))
- **cli:** add upload command entry point ([6c76eee](https://github.com/pkc918/mpc-plus/commit/6c76eee928abaaa9e19a27ef20591591b8c5010d))
- **cli:** add upload workflow logging ([4092bd9](https://github.com/pkc918/mpc-plus/commit/4092bd9df5b6c5acf648b484b868fd83457bd22c))
- **cli:** load mode-specific env before config ([c378185](https://github.com/pkc918/mpc-plus/commit/c378185dcf670c4590e0525b7f143bc29f90dac2))
- **cli:** resolve upload config by environment ([150166b](https://github.com/pkc918/mpc-plus/commit/150166b907a150c616ff434e89aa646b1085562d))
- **cli:** support uploading all configured environments ([b5a5de3](https://github.com/pkc918/mpc-plus/commit/b5a5de30a780e4adbef8e234f3fa4f7161426964))
- **config:** add typed platform configuration ([7d49430](https://github.com/pkc918/mpc-plus/commit/7d49430df23b780dd148e2bf74ebcdf7c86d5f8e))
- **config:** support environment-specific platform settings ([35cc9bc](https://github.com/pkc918/mpc-plus/commit/35cc9bc446b11e7a67452258a7c285f142dbdb72))
- **core:** add platform registry and upload orchestration ([8a1b13f](https://github.com/pkc918/mpc-plus/commit/8a1b13f8396cd2801f0685a00b9de590d00004e3))
- **standard:** wire standard runtime and config ([0e1e2bd](https://github.com/pkc918/mpc-plus/commit/0e1e2bd14d223627c66c8b0ffe03f0058a18400d))
- **types:** add typed upload configuration resolution ([3e4cfaa](https://github.com/pkc918/mpc-plus/commit/3e4cfaa18ce2cd135bd53f3127553811bc5aff3b))
- **wechat:** add WeChat platform adapter ([4817198](https://github.com/pkc918/mpc-plus/commit/481719868575182a9aac776c20ca47c05b35d62d))
- **wechat:** implement mini program uploads ([7eea419](https://github.com/pkc918/mpc-plus/commit/7eea4196c9e623030ca74e993b638cb0efd509be))

### Bug Fixes

- **ci:** build workspace packages before running tests ([001f349](https://github.com/pkc918/mpc-plus/commit/001f34906dcbe93aea11a8755fae85f0ea84b7b5))
- **wechat:** use private key file path ([89c4b33](https://github.com/pkc918/mpc-plus/commit/89c4b337dbe8cd26eaf32c9636c4f9fd3b129844))
