import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    coverage: {
      reporter: ["text", "json", "html"],
      // exclude only works in other pcs for some unknow reason
      // exclude: [
      //   "**/src/models/**",
      //   "**/src/@types/**",
      //   "**/eslint.config.mjs",
      //   "**/next.config.ts",
      //   "**/postcss.config.mjs",
      //   "**/vitest.config.mts",
      //   "next-exchange-front",
      //   "**/src/app/layout.tsx",
      // ],
      reportsDirectory: "./coverage",
    },
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/__tests__/setup.ts",
  },
});
