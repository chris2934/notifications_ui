import { createApp } from 'vue'
import { Amplify } from 'aws-amplify'
import awsConfig from './aws-exports'
import App from './App.vue'

// Configure Amplify with proper configuration
Amplify.configure({
    API: {
        GraphQL: {
            endpoint: awsConfig.aws_appsync_graphqlEndpoint,
            region: awsConfig.aws_appsync_region,
            defaultAuthMode: 'apiKey',
            apiKey: awsConfig.aws_appsync_apiKey
        }
    },
    //Disable storage
    ssr: true,
    Storage: {
        skipStorageConfig: true
    }
})

const app = createApp(App)
app.mount('#app')
