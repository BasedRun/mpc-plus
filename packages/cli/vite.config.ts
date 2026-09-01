import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/index.ts", "src/bin.ts"],
    dts: {
      tsgo: true,
    },
    exports: {
      exclude: ["bin"],
      bin: {
        mpc: "./src/bin.ts",
      },
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
