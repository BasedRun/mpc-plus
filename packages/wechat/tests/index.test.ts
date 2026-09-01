import { expectTypeOf, test } from "vite-plus/test";
import type { WechatConfig } from "../src/index.ts";

test("exports the WeChat configuration contract", () => {
  expectTypeOf<WechatConfig>().toHaveProperty("appid");
  expectTypeOf<WechatConfig>().toHaveProperty("privateKey");
});
