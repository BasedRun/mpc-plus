import type { Platform } from "@mpc-plus/core";
import type { XhsConfig } from "./config.ts";
import { upload } from "./upload.ts";

export const xhsPlatform: Platform<XhsConfig> = {
  name: "xhs",
  upload,
};
