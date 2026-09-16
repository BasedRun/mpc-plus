import { expectTypeOf, test } from "vite-plus/test";
import type { ProjectConfig, ReleaseConfig } from "@mpc-plus/core";
import type { DouyinConfig, DouyinUploadOptions } from "../src/index.ts";

test("exports the Douyin configuration contract", () => {
  expectTypeOf<DouyinConfig["project"]>().toEqualTypeOf<ProjectConfig | undefined>();
  expectTypeOf<DouyinConfig["release"]>().toEqualTypeOf<ReleaseConfig | undefined>();
  expectTypeOf<keyof DouyinUploadOptions>().toEqualTypeOf<"channel" | "needUploadSourcemap">();
});
