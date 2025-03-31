import { createClient } from 'graphql-ws';
import { MESSAGE_SUBSCRIPTION, UPDATE_MESSAGE_READ_STATUS } from "@/graphql/queries.js";
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

// Define your WebSocket client
export const client = createClient({
    url: import.meta.env.VITE_GRAPHQL_WS_ENDPOINT,
    connectionParams: {
        headers: {
            "x-api-key": import.meta.env.VITE_GRAPHQL_AUTH_TOKEN,
        },
    },
});

// Apollo Client for handling the mutation
export const apolloClient = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT, // HTTP endpoint for mutations/queries
    cache: new InMemoryCache(),
    headers: {
        "x-api-key": import.meta.env.VITE_GRAPHQL_AUTH_TOKEN,
    },
});

export default function subscribeToMessages(callback) {
    // Ensure the callback is provided
    if (typeof callback !== 'function') {
        throw new Error('A callback function is required for message subscription.');
    }

    const unsubscribe = client.subscribe(
        {
            query: MESSAGE_SUBSCRIPTION, // GraphQL subscription query
        },
        {
            next: (data) => {
                if (data?.data?.onNewMessage) {
                    const newMessage = data.data.onNewMessage;

                    // Trigger the callback with the new message
                    callback(newMessage);

                    // Optionally, automatically mark the message as read
                    markMessageAsRead(newMessage);
                } else {
                    console.warn('No message received in subscription payload:', data);
                }
            },
            error: (err) => {
                console.error('Subscription error:', err);
            },
            complete: () => {
                console.log('Subscription completed.');
            },
        }
    );

    return {
        unsubscribe: () => {
            unsubscribe();
            console.log('Unsubscribed from messages.');
        },
    };
}

// Mark message as read using Apollo's client mutation
function markMessageAsRead(message) {
    if (!message?.MessageId || !message?.ReceivedAt) {
        console.error('MessageId or ReceivedAt is missing. Cannot mark the message as read.');
        return;
    }

    apolloClient
        .mutate({
            mutation: UPDATE_MESSAGE_READ_STATUS,
            variables: {
                input: {
                    MessageId: message.MessageId,
                    ReceivedAt: message.ReceivedAt,
                    isRead: true,
                },
            },
        })
        .then((result) => {
            console.log('Message successfully marked as read:', result.data.updateMessage);
        })
        .catch((error) => {
            console.error('Failed to mark message as read:', error);
        });
}