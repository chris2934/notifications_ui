import { createApp } from 'vue';
import { Amplify } from 'aws-amplify'; // Import Amplify first
import awsExports from './aws-exports'; // Import the configuration file

Amplify.configure(awsExports); // Configure Amplify at the top

import App from './App.vue'; // Import the rest after configuration
import client from '@/graphql/subscriptionClient';
import '@fontsource/material-symbols-outlined';
import 'material-symbols';

// Create and mount the app
const app = createApp(App);
app.config.globalProperties.$wsClient = client;
app.mount('#app');