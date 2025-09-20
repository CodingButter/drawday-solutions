/* eslint-disable @typescript-eslint/no-var-requires */
const { defineConfig } = require("tsup");

module.exports = defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  minify: false,
  target: "es2020",
  external: [],
});
