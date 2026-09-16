import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
    tasks: {
      changelog: {
        command:
          "conventional-changelog -p conventionalcommits -t v -r 0 -o CHANGELOG.md && vp fmt CHANGELOG.md",
        cache: false,
      },
    },
  },
});
