import baseConfig from "@raffle-spinner/tsup-config/react";
import { defineConfig } from "tsup";

export default defineConfig({
  ...baseConfig,
  dts: process.env.VERCEL ? false : baseConfig.dts, // Disable DTS on Vercel
  esbuildOptions: (options) => {
    options.jsx = 'automatic'; // Use automatic JSX runtime
  },
});
