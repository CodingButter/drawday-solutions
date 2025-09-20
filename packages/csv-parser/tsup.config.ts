import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: false, // Temporarily disabled due to tsup/TypeScript issue
  clean: false, // Don't clean to preserve manually generated types
});
