import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client"
import { WebSocketLink } from "@apollo/client/link/ws"
import { getMainDefinition } from "@apollo/client/utilities"
import {
  MESSAGE_SUBSCRIPTION,
  UPDATE_MESSAGE_READ_STATUS,
} from "@/graphql/queries.js"

// Initialize HTTP Link for Queries and Mutations
const httpLink = new HttpLink({
  uri:
    import.meta.env.VITE_GRAPHQL_ENDPOINT ||
    "https://ztjvnzn4pvddjmiufzjlhs7rhi.appsync-api.us-east-1.amazonaws.com/graphql",
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY, // Ensure the API key is set correctly
  },
})

// Initialize WebSocket Link for Subscriptions
const wsLink = new WebSocketLink({
  uri:
    import.meta.env.VITE_GRAPHQL_WS_ENDPOINT ||
    "wss://ztjvnzn4pvddjmiufzjlhs7rhi.appsync-realtime-api.us-east-1.amazonaws.com/graphql",
  options: {
    reconnect: true, // Automatically reconnect on WebSocket disruptions
    connectionParams: {
      // Include API key in WebSocket connection parameters
      "x-api-key":
        import.meta.env.VITE_API_KEY || "da2-rkzr6tuboffz3iaorkfogfefvu",
    },
  },
  webSocketImpl: typeof WebSocket !== "undefined" ? WebSocket : require("ws"), // Use browser or Node.js WebSocket implementation
})

// Combine HTTP and WebSocket Links Using Split
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink, // Use WebSocketLink for subscriptions
  httpLink, // Use HttpLink for queries and mutations
)

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://ztjvnzn4pvddjmiufzjlhs7rhi.appsync-api.us-east-1.amazonaws.com/graphql",
    headers: {
      "x-api-key": "da2-rkzr6tuboffz3iaorkfogfefvu", // Set additional headers if needed
    },
  }),
  cache: new InMemoryCache(),
})

/**
 * Subscribe to new messages via WebSocket with a callback function for updates.
 * @param {Function} callback - Function to handle new messages received via subscription
 * @returns {Object} - Object with an `unsubscribe` method
 */
export default function subscribeToMessages(callback) {
  if (typeof callback !== "function") {
    throw new Error("A callback function is required for message subscription.")
  }

  // Start subscription
  const subscription = client
    .subscribe({
      query: MESSAGE_SUBSCRIPTION, // MESSAGE_SUBSCRIPTION must be a valid `gql`-tagged query
    })
    .subscribe({
      next: (data) => {
        console.log("Subscription payload received:", data)
        if (data?.data?.onNewMessage) {
          const newMessage = data.data.onNewMessage
          callback(newMessage) // Pass the new message to the callback
        } else {
          console.warn("Unexpected subscription payload:", data)
        }
      },
      error: (err) => {
        console.error("Subscription error occurred:", err)
      },
      complete: () => {
        console.log("Subscription completed.")
      },
    })

  // Return a cleanup method for unsubscribing
  return {
    unsubscribe: () => {
      subscription.unsubscribe()
      console.log("Unsubscribed from messages.")
    },
  }
}

/**
 * Marks a message as read using Apollo Client's mutate function.
 * @param {Object} message - The message object containing its ID and timestamp
 */
export function markMessageAsRead(message) {
  if (!message?.MessageId || !message?.ReceivedAt) {
    console.error(
      "MessageId or ReceivedAt is missing. Cannot mark message as read.",
    )
    return
  }

  // Run the mutation to mark the message as read
  client
    .mutate({
      mutation: UPDATE_MESSAGE_READ_STATUS, // UPDATE_MESSAGE_READ_STATUS must be a valid `gql`-tagged mutation
      variables: {
        input: {
          MessageId: message.MessageId,
          ReceivedAt: message.ReceivedAt,
          isRead: true, // Mark the message as read
        },
      },
    })
    .then((result) => {
      const success = result?.data?.updateMessage?.success
      if (success) {
        console.log(
          "Message successfully marked as read:",
          result.data.updateMessage,
        )
      } else {
        console.error(
          "Failed to mark message as read. Server returned an error:",
          result.errors,
        )
      }
    })
    .catch((error) => {
      if (error.graphQLErrors) {
        console.error("GraphQL Errors:", error.graphQLErrors)
      }
      if (error.networkError) {
        console.error("Network Error:", error.networkError)
      } else {
        console.error("Failed to mark message as read:", error)
      }
    })
}
