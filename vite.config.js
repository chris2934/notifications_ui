import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser', // Required for Amplify to work in browser environments
      '@': '/src', // Aliases the `src` folder for imports
    },
  },
  optimizeDeps: {
    include: [
      '@aws-amplify/core',
      '@aws-amplify/api',
      '@aws-amplify/api-graphql',
    ], // Ensures Vite pre-bundles these modules
  },
  define: {
    // Define global variables expected by dependencies
    global: 'window', // Needed for browser environments
    'process.env': {}, // Ensures compatibility with libraries expecting Node's process.env
  },
});