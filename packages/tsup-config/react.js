/* eslint-disable @typescript-eslint/no-var-requires */
const { defineConfig } = require("tsup");
const baseConfig = require("./base");

module.exports = defineConfig({
  ...baseConfig,
  external: ["react", "react-dom"],
  target: "node16",
  banner: {
    js: "'use client';\n",
  },
});
