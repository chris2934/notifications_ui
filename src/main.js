// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import { Amplify } from 'aws-amplify'
import { amplifyConfig } from './config/amplify'

// Configure Amplify
try {
    console.log('Amplify Configuration:', amplifyConfig) // For debugging
    Amplify.configure(amplifyConfig)
} catch (error) {
    console.error('Amplify configuration error:', error)
}

const app = createApp(App)
app.mount('#app')
