import { createApp } from 'vue';
import App from './App.vue';
import { Amplify } from 'aws-amplify';
import '@fontsource/material-symbols-outlined';
import 'material-symbols';
import router from './router';
import awsExports from "./aws-exports";
import client from "@/graphql/subscriptionClient";


// Correct Amplify Configuration
const amplifyConfig = {
    API: {
        aws_appsync_graphqlEndpoint: 'https://ztjvnzn4pvddjmiufzjlhs7rhi.appsync-api.us-east-1.amazonaws.com/graphql',
        aws_appsync_region: 'us-east-1',
        aws_appsync_authenticationType: 'API_KEY',
        aws_appsync_apiKey: 'da2-auztuvrhxzbvdi6fhoztqilst4',
    }
};

// Debugging to check configuration values
console.log('[DEBUG] Amplify Configuration:', amplifyConfig);

// Configure Amplify
try {
    Amplify.configure(awsExports);
    console.log('[DEBUG] Amplify successfully configured');
} catch (error) {
    console.error('[ERROR] Amplify configuration failed:', error);
}

// Create and mount the Vue app
const app = createApp(App);
app.config.globalProperties.$wsClient = client;
app.use(router);
app.mount('#app');