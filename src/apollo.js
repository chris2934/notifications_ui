// apollo.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { createAuthLink } from 'aws-appsync-auth-link'
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link'

const config = {
    url: import.meta.env.VITE_APPSYNC_API_URL,
    region: import.meta.env.VITE_AWS_REGION,
    auth: {
        type: 'AMAZON_COGNITO_USER_POOLS',
    }
}

const httpLink = createHttpLink({ uri: config.url })
const authLink = createAuthLink(config)
const subscriptionLink = createSubscriptionHandshakeLink(config)

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network'
        }
    }
})
