import { expect, expectTypeOf, test } from "vite-plus/test";
import { defineConfig, type MPCConfig } from "../src/index.ts";

test("defineConfig preserves the standard configuration", () => {
  const config = defineConfig({
    platforms: {
      wechat: [
        {
          env: "production",
          appid: "appid",
          privateKey: "private-key",
        },
      ],
    },
  });

  expect(defineConfig(config)).toBe(config);
  expectTypeOf(config).toMatchTypeOf<MPCConfig>();
});
