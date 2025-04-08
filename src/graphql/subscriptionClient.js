import { gql, ApolloClient, InMemoryCache, split } from "@apollo/client"
import { WebSocketLink } from "@apollo/client/link/ws"
import { HttpLink } from "@apollo/client/link/http" // Import HttpLink for queries/mutations
import { getMainDefinition } from "@apollo/client/utilities"
import {
  MESSAGE_SUBSCRIPTION,
  UPDATE_MESSAGE_READ_STATUS,
} from "@/graphql/queries.js"

// Initialize HTTP Link (for Queries and Mutations)
const httpLink = new HttpLink({
  uri:
    import.meta.env.VITE_GRAPHQL_ENDPOINT ||
    "https://ztjvnzn4pvddjmiufzjlhs7rhi.appsync-api.us-east-1.amazonaws.com/graphql",
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
})

// Initialize WebSocket Link (for Subscriptions)
const wsLink = new WebSocketLink({
  uri:
    import.meta.env.VITE_GRAPHQL_WS_ENDPOINT ||
    "wss://ztjvnzn4pvddjmiufzjlhs7rhi.appsync-realtime-api.us-east-1.amazonaws.com/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      authHeader: {
        "x-api-key":
          import.meta.env.VITE_API_KEY || "da2-rkzr6tuboffz3iaorkfogfefvu",
      },
    },
  },
  webSocketImpl: typeof WebSocket !== "undefined" ? WebSocket : require("ws"), // Use browser or Node.js WebSocket
})

// Combine HTTP and WebSocket Links for Apollo Client
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink, // Handle subscriptions via WebSocket
  httpLink, // Handle queries and mutations via HTTP
)

// Create the Apollo Client
export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true, // Enable debugging in browser dev tools
})

/**
 * Subscribe to new messages via WebSocket with a callback function for updates.
 * @param {Function} callback - Callback function to handle new messages received via the subscription
 * @returns {Object} - Object with an `unsubscribe` method
 */
export default function subscribeToMessages(callback) {
  if (typeof callback !== "function") {
    throw new Error("A callback function is required for message subscription.")
  }

  const parsedSubscriptionQuery = gql`
    ${MESSAGE_SUBSCRIPTION}
  `

  // Start subscription
  const subscription = client
    .subscribe({
      query: parsedSubscriptionQuery,
    })
    .subscribe({
      next: (data) => {
        console.log("Subscription payload received:", data)
        if (data?.data?.onNewMessage) {
          const newMessage = data.data.onNewMessage
          callback(newMessage)
          markMessageAsRead(newMessage)
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
 * Mark a message as read using Apollo Client's mutate function.
 * @param {Object} message - The message that was received
 */
function markMessageAsRead(message) {
  if (!message?.MessageId || !message?.ReceivedAt) {
    console.error(
      "MessageId or ReceivedAt is missing. Cannot mark message as read.",
    )
    return
  }

  apolloClient
    .mutate({
      mutation: gql`
        ${UPDATE_MESSAGE_READ_STATUS}
      `,
      variables: {
        input: {
          MessageId: message.MessageId,
          ReceivedAt: message.ReceivedAt,
          isRead: true,
        },
      },
    })
    .then((result) => {
      console.log(
        "Message successfully marked as read:",
        result.data.updateMessage,
      )
    })
    .catch((error) => {
      console.error("Failed to mark message as read:", error)
    })
}
