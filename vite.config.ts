import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import checker from "vite-plugin-checker"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react(), checker({ typescript: true })],
    base: env.VITE_BASE_URL || "/",
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
  }
})
