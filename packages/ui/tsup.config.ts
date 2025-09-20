import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: false, // Disabled due to Fatal error - using tsc separately
  clean: true,
  external: ["react", "react-dom", "@raffle-spinner/utils"],
  sourcemap: true,
  minify: false,
  splitting: false,
  banner: {
    js: "'use client';\n",
  },
});
