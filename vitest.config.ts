import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["**/tests/**/*.test.tsx"], // or .js if using JavaScript
    // other Vitest configurations
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
  },
})
