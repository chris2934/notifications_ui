import { createClient } from 'graphql-ws';
import gql from 'graphql-tag';
import {MESSAGE_SUBSCRIPTION} from "@/graphql/queries.js";

// Define your WebSocket client
const client = createClient({
    url: 'wss://your-graphql-endpoint.com/graphql', // Replace with your WebSocket URL
});

// Function to subscribe to new messages
export default function subscribeToMessages(callback) {
    // Ensure the callback is provided
    if (typeof callback !== 'function') {
        throw new Error('A callback function is required for message subscription.');
    }

    // Start the subscription
    const unsubscribe = client.subscribe(
        {
            query: MESSAGE_SUBSCRIPTION, // GraphQL subscription query
        },
        {
            next: (data) => {
                if (data?.data?.onNewMessage) {
                    callback(data.data.onNewMessage); // Pass the new message to the callback
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

    // Return the unsubscribe function
    return {
        unsubscribe: () => {
            unsubscribe();
            console.log('Unsubscribed from messages.');
        },
    };
}