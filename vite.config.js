import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
      "@": "/src",
    },
  },
  optimizeDeps: {
    include: [
      "@aws-amplify/core",
      "@aws-amplify/api",
      "@aws-amplify/api-graphql",
    ],
  },
  define: {
    global: "window",
    "process.env": {},
  },
})
