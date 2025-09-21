import baseConfig from "@raffle-spinner/tsup-config/base";
import { defineConfig } from "tsup";

export default defineConfig({
  ...baseConfig,
  dts: process.env.VERCEL ? false : baseConfig.dts, // Disable DTS on Vercel
});
