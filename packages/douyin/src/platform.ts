import type { Platform } from "@mpc-plus/core";
import type { DouyinConfig } from "./config.ts";
import { upload } from "./upload.ts";

export const douyinPlatform: Platform<DouyinConfig> = {
  name: "douyin",
  upload,
};
