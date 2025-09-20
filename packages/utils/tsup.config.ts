import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: false,
  clean: false, // Don't clean so we preserve manually generated .d.ts files
  sourcemap: true,
  minify: false,
  splitting: false,
  external: [],
});
