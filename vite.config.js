import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
      '@': '/src',
      "aws-amplify": "/node_modules/aws-amplify"
    }
  },
  define: {
    global: {},
    'process.env': {}
  }
})
