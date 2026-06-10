// Uses Apollo Client with AppSync handshake for subscriptions
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client"
import { createAuthLink } from "aws-appsync-auth-link"
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link"
import {
  MESSAGE_SUBSCRIPTION,
  UPDATE_MESSAGE_READ_STATUS,
} from "@/graphql/queries.js"
import gql from "graphql-tag"

// Environment configuration (do not hardcode secrets)
const url = import.meta.env.VITE_GRAPHQL_ENDPOINT
const region =
  import.meta.env.VITE_APPSYNC_REGION || import.meta.env.VITE_AWS_REGION
const apiKey = import.meta.env.VITE_API_KEY

if (!url || !region || !apiKey) {
  console.warn("Missing AppSync env config. Check VITE_* variables in .env.")
}

// Base HTTP link for queries/mutations
const httpLink = new HttpLink({ uri: url })

// Auth config for AppSync
const auth = {
  type: "API_KEY",
  apiKey,
}

// Chain: auth link -> subscription handshake link
const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth }, httpLink),
])

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

// Subscribe to new messages
export default function subscribeToMessages(callback) {
  if (typeof callback !== "function") {
    throw new Error("A callback function is required for message subscription.")
  }

  const sub = client
    .subscribe({
      query: gql(MESSAGE_SUBSCRIPTION),
    })
    .subscribe({
      next: (data) => {
        console.log("Subscription payload received:", data)

        const newMessage = data?.data?.onNewMessage

        if (newMessage) {
          callback(newMessage)
        }
      },
      error: (err) => {
        console.error("Subscription error:", err)
      },
      complete: () => {
        console.log("Subscription completed.")
      },
    })

  return {
    unsubscribe: () => sub.unsubscribe(),
  }
}

// Mutation to mark a message as read
export function markMessageAsRead(message) {
  if (!message?.MessageId || !message?.ReceivedAt) {
    console.error(
      "MessageId or ReceivedAt is missing. Cannot mark message as read.",
    )
    return
  }

  client
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
      const updatedMessage = result?.data?.updateMessage

      if (updatedMessage) {
        console.log("Message successfully marked as read:", updatedMessage)
      } else {
        console.error(
          "Failed to mark message as read. Server returned an error:",
          result?.errors,
        )
      }
    })
    .catch((error) => {
      if (error.graphQLErrors) {
        console.error("GraphQL Errors:", error.graphQLErrors)
      }

      if (error.networkError) {
        console.error("Network Error:", error.networkError)
      }

      if (!error.graphQLErrors && !error.networkError) {
        console.error("Failed to mark message as read:", error)
      }
    })
}
