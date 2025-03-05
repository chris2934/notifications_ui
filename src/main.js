import {createApp} from 'vue'
import App from './App.vue'
import {Amplify} from 'aws-amplify'
import '@fontsource/material-symbols-outlined'
import 'material-symbols'
import router from './router'

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'us-east-1_pgNeEhS3I',
            userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
            region: 'us-east-1'
        }
    },
    API: {
        GraphQL: {
            endpoint: import.meta.env.VITE_APPSYNC_API_URL,
            region: 'us-east-1',
            defaultAuthMode: 'userPool'
        }
    }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
