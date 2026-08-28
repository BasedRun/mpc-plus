import { expectTypeOf, test } from "vite-plus/test";
import type { MpcConfigInput, PlatformDefinition } from "../src/index.ts";

test("infers platform config inputs from a registry", () => {
  type Registry = {
    example: PlatformDefinition<"example", { appid: string }>;
  };

  expectTypeOf<MpcConfigInput<Registry>["platforms"]>().toEqualTypeOf<{
    example?: { appid: string };
  }>();
});
