import type { Platform } from "@mpc-plus/core";
import type { AlipayConfig } from "./config.ts";
import { upload } from "./upload.ts";

export const alipayPlatform: Platform<AlipayConfig> = {
  name: "alipay",
  upload,
};
