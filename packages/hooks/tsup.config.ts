import baseConfig from "@raffle-spinner/tsup-config/react";
import { defineConfig } from "tsup";

export default defineConfig({
  ...baseConfig,
  external: [...(baseConfig.external || []), "@raffle-spinner/utils"],
});
