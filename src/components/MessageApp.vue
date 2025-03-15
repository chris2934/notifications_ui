<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { createClient } from "graphql-ws";
import Header from "./MessageHeader.vue";
import { GET_MESSAGES, MESSAGE_SUBSCRIPTION, UPDATE_MESSAGE_READ_STATUS } from "../graphql/queries";
import { sortMessagesByTimestamp } from "../utils/messageHelpers";

// Load the GraphQL API endpoint and WebSocket endpoint from the .env file
const apiKey = import.meta.env.VITE_API_KEY;
const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT; // For HTTP POST
const graphqlWsEndpoint = import.meta.env.VITE_GRAPHQL_WS_ENDPOINT; // For WebSocket

// Reactive states
const messages = ref([]);
const loading = ref(true);

// State to maintain WebSocket subscription
let subscriptionClient = null;
let subscriptionDisposeFn = null;

// Computed property: count of unread messages
const unreadCount = computed(() =>
    messages.value.filter((message) => !message.isRead).length
);

// Transform function: Optimizes fetched and incoming messages
const transformMessage = (msg) => ({
  MessageId: msg.MessageId,
  ReceivedAt: msg.ReceivedAt,
  isRead: msg.isRead || false,
  MessageBody: {
    content: msg?.MessageBody?.content || "",
    metadata: {
      type: msg?.MessageBody?.metadata?.type || "NOTIFICATION",
      version: msg?.MessageBody?.metadata?.version || "1.0",
    },
    status: msg?.MessageBody?.status || "UNKNOWN",
    timestamp: msg?.MessageBody?.timestamp || msg?.ReceivedAt,
  },
});

// Fetch messages using axios
const fetchMessages = async () => {
  try {
    loading.value = true;

    const response = await axios.post(graphqlEndpoint, {
      query: GET_MESSAGES,
      headers:{
        'x-api-key': apiKey,
      }
    });
    const fetchedMessages = response?.data?.data?.getMessages || [];
    messages.value = fetchedMessages
        .filter((msg) => msg?.MessageId && msg?.ReceivedAt && msg?.MessageBody)
        .map(transformMessage)
        .sort(sortMessagesByTimestamp);

  } catch (error) {
    console.error("Error fetching messages:", error);
    messages.value = [];
  } finally {
    loading.value = false;
  }
};

// Mark a message as read in the backend and update it locally
const markAsRead = async (messageId) => {
  try {
    await axios.post(graphqlEndpoint, {
      query: UPDATE_MESSAGE_READ_STATUS,
      variables: { input: { MessageId: messageId, isRead: true } },
    });

    // Update local state
    messages.value = messages.value.map((msg) =>
        msg.MessageId === messageId ? { ...msg, isRead: true } : msg
    );

  } catch (error) {
    console.error("Error marking message as read:", error);
  }
};

// Setup WebSocket subscription for new messages
// const setupMessageSubscription = () => {
//   // Initialize the WebSocket subscription client
//   subscriptionClient = createClient({
//     url: graphqlWsEndpoint,
//     connectionParams: {
//       Authorization: `Bearer YOUR_AUTH_TOKEN`, // Replace with actual token if required
//     },
//   });
//
//   // Subscribe to MESSAGE_SUBSCRIPTION
//   subscriptionDisposeFn = subscriptionClient.subscribe(
//       {
//         query: MESSAGE_SUBSCRIPTION,
//       },
//       {
//         next: ({ data, errors }) => {
//           if (errors) {
//             console.error("Subscription errors:", errors);
//             return;
//           }
//
//           const newMessage = data?.onNewMessage;
//           if (newMessage) {
//             messages.value = [
//               ...messages.value,
//               transformMessage(newMessage),
//             ].sort(sortMessagesByTimestamp);
//           }
//         },
//         error: (err) => {
//           console.error("WebSocket subscription error:", err);
//         },
//         complete: () => {
//           console.log("Subscription completed");
//         },
//       }
//   );
// };

// Cleanup WebSocket subscription
// const cleanupSubscription = () => {
//   if (subscriptionDisposeFn) {
//     subscriptionDisposeFn();
//     subscriptionDisposeFn = null;
//   }
//   if (subscriptionClient) {
//     subscriptionClient.dispose();
//     subscriptionClient = null;
//   }
// };

// Hook into lifecycle events
onMounted(async () => {
  await fetchMessages();
  //setupMessageSubscription();
});

// onUnmounted(() => {
//   cleanupSubscription();
// });
</script>

<template>
  <div class="app-container">
    <Header
        :messages="messages"
        :loading="loading"
        :unread-count="unreadCount"
        :mark-as-read="markAsRead"
    />
    <div class="main-content">
      <!-- Additional content goes here -->
    </div>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  margin-top: 80px;
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>