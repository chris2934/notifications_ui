<template>
  <div class="app-container">
    <Header
        :messages="messages"
        :loading="loading"
        :unread-count="unreadCount"
        :mark-as-read="markAsRead"
    />
    <div class="main-content"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Header from "./MessageHeader.vue";
import { GET_MESSAGES } from "../graphql/queries";
import { sortMessagesByTimestamp } from "../utils/messageHelpers";

// API keys and endpoints
const apiKey = import.meta.env.VITE_API_KEY;
const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT;

// State
const messages = ref([]);
const loading = ref(true);

// Computed: Count unread messages
const unreadCount = computed(() =>
    messages.value.filter((message) => !message.isRead).length
);

// Helper: Transform fetched/incoming messages to standard format
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

const fetchMessages = async () => {
  try {
    loading.value = true;
    const response = await axios.post(
        graphqlEndpoint,
        {
          query: GET_MESSAGES,
        },
        {
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
        }
    );
    const fetchedMessages = Array.isArray(response?.data?.data?.getMessages)
        ? response.data.data.getMessages
        : [];

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
}

// Fetch messages on component mount
onMounted(fetchMessages);
</script>

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