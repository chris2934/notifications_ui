<template>
  <div ref="messageList" class="message-list">
    <!-- Loading State -->
    <div v-if="loading && localMessages.length === 0" class="loading">
      Loading messages...
    </div>
    <!-- No Messages -->
    <div v-else-if="!localMessages.length && !loading" class="no-messages">
      No messages yet
    </div>
    <!-- Message List -->
    <div v-else class="messages-container">
      <div
        v-for="message in sortedMessages"
        :key="message.MessageId"
        :class="{ unread: !message.isRead, read: message.isRead }"
        class="message-wrapper"
        @click="markAsRead(message)"
      >
        <MessageItem :message="message" class="message-item" />
      </div>
      <!-- Sentinel Element for Infinite Scroll -->
      <div ref="sentinel" class="scroll-sentinel"></div>
    </div>
    <!-- Infinite Scroll Loading -->
    <div v-if="loadingMore" class="loading-more">Loading more messages...</div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import MessageItem from "./MessageItem.vue"
import subscribeToMessages, {
  markMessageAsRead,
} from "@/graphql/subscriptionClient.js" // Import markMessageAsRead here

// Props to get initial messages and loading functions
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
})

// Reactive Variables
const sentinel = ref(null)
const intersectionObserver = ref(null)
const loadingMore = ref(false)
const subscriptionCleanup = ref(null)

// Local Reactive Messages State
const localMessages = ref([...messages])

// Set of Message IDs (to track uniqueness)
const messageIds = new Set(messages.map((msg) => msg.MessageId))

// Computed Sorted Messages (sorted by date - newest first)
const sortedMessages = computed(() => {
  return [...localMessages.value].sort(
    (a, b) => new Date(b.ReceivedAt) - new Date(a.ReceivedAt),
  )
})

// Watch for New Props and Sync with Local Messages
watch(
  () => messages,
  (newMessages) => {
    newMessages.forEach((msg) => {
      if (!messageIds.has(msg.MessageId)) {
        messageIds.add(msg.MessageId)
        localMessages.value.push(msg) // Add new unique messages
      }
    })
  },
)

// Mark Message as Read
const markAsRead = async (message) => {
  if (!message || message.isRead) {
    console.log("Message already read or invalid:", message)
    return
  }
  try {
    markMessageAsRead(message) // Call the centralized function
    message.isRead = true // Update the message locally to reflect the read status instantly
    console.log("Message marked as read successfully.")
  } catch (error) {
    console.error("Error marking message as read:", error)
  }
}

// Handle Infinite Scroll
const handleIntersection = async (entries) => {
  const [entry] = entries
  if (entry.isIntersecting && !loadingMore.value) {
    try {
      loadingMore.value = true
      await fetchMoreMessages() // Fetch older messages
    } catch (error) {
      console.error("Error fetching more messages:", error)
    } finally {
      loadingMore.value = false
    }
  }
}

// Setup Real-Time Subscription for New Messages
const setupSubscription = () => {
  try {
    console.log("Setting up subscription...")
    subscriptionCleanup.value = subscribeToMessages((newMessage) => {
      console.log("New message received:", newMessage)

      // Ignore invalid or duplicate messages
      if (
        !newMessage ||
        !newMessage.MessageId ||
        messageIds.has(newMessage.MessageId)
      ) {
        console.warn("Ignoring duplicate or invalid message:", newMessage)
        return
      }

      // Add new unique message
      messageIds.add(newMessage.MessageId)
      localMessages.value.unshift(newMessage) // Add to the top of the list
    })
  } catch (error) {
    console.error("Error setting up subscription:", error)
  }
}

// Lifecycle: Mount
onMounted(() => {
  setupSubscription() // Start subscription

  // Setup Infinite Scroll Observer
  if (sentinel.value) {
    intersectionObserver.value = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    })
    intersectionObserver.value.observe(sentinel.value)
  }
})

// Lifecycle: Unmount
onUnmounted(() => {
  // Cleanup subscription
  if (subscriptionCleanup.value) {
    subscriptionCleanup.value.unsubscribe()
  }
  // Cleanup intersection observer
  if (intersectionObserver.value) {
    if (sentinel.value) {
      intersectionObserver.value.unobserve(sentinel.value)
    }
    intersectionObserver.value.disconnect()
  }
})
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
  font-size: 1.2em;
  color: #999;
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
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.message-wrapper:hover {
  background: #f9f9f9;
}

.message-wrapper:last-child {
  border-bottom: none;
}

.scroll-sentinel {
  height: 1px;
  background: transparent;
}

.unread {
  color: #333;
}
</style>
