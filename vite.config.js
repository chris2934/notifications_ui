import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
      '@': '/src'  // Add this if you're using path aliases
    }
  },
  define: {
    global: {},
    'process.env': {}
  }
})
