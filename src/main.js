import { createApp } from 'vue';
import App from './App.vue';
import { Amplify } from 'aws-amplify'; // Import Amplify
import '@fontsource/material-symbols-outlined'; // Necessary fonts import
import 'material-symbols';
import awsExports from './aws-exports'; // AWS Amplify configuration file
import client from '@/graphql/subscriptionClient'; // WebSocket client for subscriptions

// Configure Amplify using the aws-exports settings
Amplify.configure(awsExports);

// Create and mount the Vue app
const app = createApp(App);
app.config.globalProperties.$wsClient = client; // Bind WebSocket client globally
app.mount('#app');