import { expectTypeOf, test } from "vite-plus/test";
import type { WechatConfigInput } from "../src/index.ts";

test("exports the WeChat configuration contract", () => {
  expectTypeOf<WechatConfigInput>().toHaveProperty("appid");
  expectTypeOf<WechatConfigInput>().toHaveProperty("privateKey");
});
