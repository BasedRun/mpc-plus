import { expectTypeOf, test } from "vite-plus/test";
import type { AlipayConfig, AlipayUploadOptions, AlipayUploadResult } from "../src/index.ts";
import type { ProjectConfig, ReleaseConfig } from "@mpc-plus/core";
import type { IPublishResult } from "minidev";

test("exports Alipay configuration and SDK result types", () => {
  expectTypeOf<AlipayConfig["identityKeyPath"]>().toEqualTypeOf<string>();
  expectTypeOf<AlipayConfig["project"]>().toEqualTypeOf<ProjectConfig | undefined>();
  expectTypeOf<AlipayConfig["release"]>().toEqualTypeOf<ReleaseConfig | undefined>();
  expectTypeOf<keyof AlipayUploadOptions>().toEqualTypeOf<"experience">();
  expectTypeOf<AlipayUploadResult>().toEqualTypeOf<IPublishResult>();
});
