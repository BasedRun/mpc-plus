import { expect, expectTypeOf, test } from "vite-plus/test";
import { defineConfig, type StandardConfigInput } from "../src/index.ts";

test("defineConfig preserves the standard configuration", () => {
  const config = defineConfig({
    platforms: {
      wechat: {
        appid: "appid",
        privateKey: "private-key",
        output: "dist/mp-weixin",
      },
    },
  });

  expect(defineConfig(config)).toBe(config);
  expectTypeOf(config).toMatchTypeOf<StandardConfigInput>();
});
