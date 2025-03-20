import { createApp } from 'vue';
import App from './App.vue';
import { Amplify } from 'aws-amplify';
import '@fontsource/material-symbols-outlined';
import 'material-symbols';
import router from './router';
import awsExports from "./aws-exports";
import client from "@/graphql/subscriptionClient";

// Debugging: Log configuration before applying
console.log('[DEBUG] Amplify Configuration from aws-exports:', awsExports);

// Configure Amplify
Amplify.configure({}); // Clear any old configuration
Amplify.configure(awsExports);

// Confirm that the config has been applied
console.log('[DEBUG] Amplify Resolved Config:', JSON.stringify((Amplify as any)._config, null, 2));

// Create and mount the Vue app
const app = createApp(App);
app.config.globalProperties.$wsClient = client;
app.use(router);
app.mount('#app');