import { expectTypeOf, test } from "vite-plus/test";
import type { XhsConfig } from "../src/index.ts";
import type { ProjectConfig, ReleaseConfig } from "@mpc-plus/core";

test("exports the XHS configuration contract", () => {
  expectTypeOf<XhsConfig["token"]>().toEqualTypeOf<string>();
  expectTypeOf<XhsConfig["appid"]>().toEqualTypeOf<string>();
  expectTypeOf<XhsConfig["project"]>().toEqualTypeOf<ProjectConfig | undefined>();
  expectTypeOf<XhsConfig["release"]>().toEqualTypeOf<ReleaseConfig | undefined>();
});
