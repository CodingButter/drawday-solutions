import baseConfig from "@raffle-spinner/tsup-config/react";
import { defineConfig } from "tsup";

export default defineConfig({
  ...baseConfig,
  external: [
    ...(baseConfig.external || []),
    "@raffle-spinner/storage",
    "@raffle-spinner/spinner-physics",
    "@raffle-spinner/utils",
    "@raffle-spinner/hooks",
  ],
});
