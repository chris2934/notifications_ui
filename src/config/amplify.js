// src/config/amplify.js
export const amplifyConfig = {
    API: {
        GraphQL: {
            endpoint: import.meta.env.VITE_APPSYNC_API_URL,
            region: import.meta.env.VITE_AWS_REGION,
            defaultAuthMode: 'API_KEY',
            api_key:'da2-auztuvrhxzbvdi6fhoztqilst4' // Your API Key
        }
    }
}
