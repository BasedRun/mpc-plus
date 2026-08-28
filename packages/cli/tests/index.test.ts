import { expect, test } from "vite-plus/test";
import { defineConfig } from "../src/index.ts";

test("re-exports defineConfig without changing its value", () => {
  const config = defineConfig({ platforms: {} });

  expect(defineConfig(config)).toBe(config);
});
