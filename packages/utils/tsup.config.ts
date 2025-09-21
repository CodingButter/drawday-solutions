import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: process.env.VERCEL ? false : true, // Disable DTS on Vercel
  clean: true,
  sourcemap: true,
  splitting: false,
  minify: false,
  target: "es2020",
  external: [],
});