import { expectTypeOf, test } from "vite-plus/test";
import type { DouyinConfigInput } from "../src/index.ts";

test("exports the Douyin configuration contract", () => {
  expectTypeOf<DouyinConfigInput>().toHaveProperty("appid");
  expectTypeOf<DouyinConfigInput>().toHaveProperty("token");
});
