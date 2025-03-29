<template>
  <div class="message-list" ref="messageList">
    <div v-if="loading && !localMessages.length" class="loading">Loading messages...</div>
    <div v-else-if="!localMessages.length && !loading" class="no-messages">No messages yet</div>
    <div v-else class="messages-container">
      <div
          v-for="message in sortedMessages"
          :key="message.MessageId"
          class="message-wrapper"
          :class="{ 'unread': !message.isRead, 'read': message.isRead }"
          @click="markAsRead(message)"
      >
        <MessageItem
            :message="message"
            class="message-item"
        />
      </div>
      <!-- Sentinel element for detecting bottom -->
      <div ref="sentinel" class="scroll-sentinel"></div>
    </div>
    <div v-if="loadingMore" class="loading-more">Loading more messages...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import MessageItem from "./MessageItem.vue";
import subscribeToMessages from "../graphql/subscriptionClient";
import { generateClient } from "aws-amplify/api";
import { UPDATE_MESSAGE_READ_STATUS } from "@/graphql/queries.js";

const client = generateClient();

// Props
const { messages, fetchMoreMessages, loading } = defineProps({
  messages: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  fetchMoreMessages: {
    type: Function,
    required: true,
  },
});

// Refs for state
const sentinel = ref(null);
const intersectionObserver = ref(null);
const loadingMore = ref(false);
const subscriptionCleanup = ref(null);

// Local copy of messages for reactivity
const localMessages = ref([...messages]);

// Track message IDs for uniqueness
const messageIds = new Set(messages.map((msg) => msg.MessageId));

// Computed property for sorting messages
const sortedMessages = computed(() => {
  return [...localMessages.value].sort(
      (a, b) => new Date(b.ReceivedAt) - new Date(a.ReceivedAt)
  );
});

// Watch 'messages' prop and sync it with 'localMessages'
watch(
    () => messages,
    (newMessages) => {
      localMessages.value = [...newMessages];
      newMessages.forEach((msg) => messageIds.add(msg.MessageId)); // Sync message IDs
    }
);

// Mark a message as read
const markAsRead = async (message) => {
  if (message.isRead) return; // Skip if already read
  try {
    await client.graphql({
      query: UPDATE_MESSAGE_READ_STATUS,
      variables: {
        input: {
          MessageId: message.MessageId,
          isRead: true,
          ReceivedAt: message.ReceivedAt,
        },
        authMode: "API_KEY",
      },
    });
    message.isRead = true; // Reflect status change locally
  } catch (err) {
    console.error("Error marking message as read:", err);
  }
};

// Function to handle fetching more messages when reaching the bottom
const handleIntersection = async (entries) => {
  const [entry] = entries;
  if (entry.isIntersecting && !loadingMore.value) {
    try {
      loadingMore.value = true;
      await fetchMoreMessages();
    } catch (err) {
      console.error("Error fetching more messages:", err);
    } finally {
      loadingMore.value = false;
    }
  }
};

// Subscribe to new messages on mounted
const setupSubscription = () => {
  try {
    subscriptionCleanup.value = subscribeToMessages((newMessage) => {
      console.log("Received new message:", newMessage); // Debugging

      if (!newMessage || !newMessage.MessageId) {
        console.error("Malformed message received:", newMessage);
        return; // Ignore invalid messages
      }

      // Check message uniqueness
      if (!messageIds.has(newMessage.MessageId)) {
        messageIds.add(newMessage.MessageId);
        localMessages.value = [newMessage, ...localMessages.value];
      }
    });
  } catch (error) {
    console.error("Error setting up subscription:", error);
  }
};

// Subscribe and setup IntersectionObserver on mount
onMounted(() => {
  setupSubscription();

  // Setup IntersectionObserver for infinite scroll
  if (sentinel.value) {
    intersectionObserver.value = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
    intersectionObserver.value.observe(sentinel.value);
  }
});

// Cleanup on unmount to prevent memory leaks
onUnmounted(() => {
  // Unsubscribe from message subscription
  if (subscriptionCleanup.value) {
    subscriptionCleanup.value.unsubscribe();
  }
  // Disconnect IntersectionObserver
  if (intersectionObserver.value) {
    if (sentinel.value) {
      intersectionObserver.value.unobserve(sentinel.value);
    }
    intersectionObserver.value.disconnect();
  }
});
</script>

<style scoped>
.message-list {
  height: 100vh;
  overflow-y: auto;
  background: transparent;
}

.loading,
.no-messages {
  text-align: center;
  padding: 20px;
  color: #666;
}

.loading-more {
  text-align: center;
  padding: 10px;
  color: #666;
}

.messages-container {
  display: flex;
  flex-direction: column;
  background: transparent;
}

.message-wrapper {
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  background: transparent;
  cursor: pointer;
}

.message-wrapper:last-child {
  border-bottom: none;
}

.scroll-sentinel {
  height: 1px;
  background: transparent;
}

.unread {
  font-weight: bold;
}
</style>