// src/config/amplify.js
export const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
            userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
            region: import.meta.env.VITE_AWS_REGION,
            loginWith: {
                username: true,
                email: true,
                phone: false
            }
        }
    },
    API: {
        GraphQL: {
            endpoint: import.meta.env.VITE_APPSYNC_API_URL,
            region: import.meta.env.VITE_AWS_REGION,
            defaultAuthMode: 'userPool'
        }
    }
}
