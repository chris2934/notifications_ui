import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vuetify from "vite-plugin-vuetify"

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
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
