import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import checker from "vite-plugin-checker"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
  base: "/poster-frontend",
  publicDir: "public",
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests",
    mockReset: true,
  },
})
