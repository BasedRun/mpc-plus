import { expectTypeOf, test } from "vite-plus/test";
import type { BaseMpcConfig, Platform } from "../src/index.ts";

test("connects platform configuration and upload option types", () => {
  type ExampleConfig = { appid: string };
  type PlatformsConfig = {
    example?: ExampleConfig;
  };

  expectTypeOf<
    NonNullable<BaseMpcConfig<PlatformsConfig>["platforms"]>
  >().toEqualTypeOf<PlatformsConfig>();
  expectTypeOf<Parameters<Platform<ExampleConfig>["upload"]>[0]>().toEqualTypeOf<ExampleConfig>();
});
