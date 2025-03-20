import { createApp } from 'vue';
import App from './App.vue';
import { Amplify } from 'aws-amplify';
import '@fontsource/material-symbols-outlined';
import 'material-symbols';
import router from './router';
import awsExports from "./aws-exports"; // Import the configuration
import client from "@/graphql/subscriptionClient";

// Debugging to confirm that configuration is being imported properly
console.log('[DEBUG] Amplify Configuration:', awsExports);

// Configure Amplify
try {
    Amplify.configure(awsExports); // Use the config from aws-exports.js
    console.log('[DEBUG] Amplify successfully configured');
} catch (error) {
    console.error('[ERROR] Amplify configuration failed:', error);
}

// Create and mount the Vue app
const app = createApp(App);
app.config.globalProperties.$wsClient = client; // Attach WebSocket client if needed
app.use(router);
app.mount('#app');