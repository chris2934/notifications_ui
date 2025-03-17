<template>
  <div class="message-list" ref="messageList">
    <div v-if="loading && !messages.length" class="loading">Loading messages...</div>
    <div v-else-if="!messages.length && !loading" class="no-messages">No messages yet</div>
    <div v-else class="messages-container">
      <div
          v-for="message in [...messages].sort((a, b) => new Date(b.ReceivedAt) - new Date(a.ReceivedAt))"
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
import { ref, watch, onMounted, onUnmounted } from 'vue'
import MessageItem from './MessageItem.vue'
import { generateClient } from 'aws-amplify/api'
import { UPDATE_MESSAGE_READ_STATUS } from '@/graphql/queries.js'

const client = generateClient()

defineProps({
  messages: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  fetchMoreMessages: {
    type: Function,
    required: true // A function to fetch more messages when needed
  }
})

// Refs for infinite scroll
const sentinel = ref(null)
const intersectionObserver = ref(null)
const loadingMore = ref(false)

const markAsRead = async (message) => {
  if (message.isRead) return
  try {
    const response = await client.graphql({
      query: UPDATE_MESSAGE_READ_STATUS,
      variables: {
        input: {
          MessageId: message.MessageId,
          isRead: true,
          ReceivedAt: message.ReceivedAt // Include this if you have it
        }
      }
    })
    message.isRead = true
  } catch (error) {
    console.error('Error marking message as read:', error)
  }
}

// Fetch more messages when scroll reaches the bottom
const handleIntersection = async (entries) => {
  const [entry] = entries
  if (entry.isIntersecting && !loadingMore.value) {
    try {
      loadingMore.value = true
      await props.fetchMoreMessages() // Fetch data and append to the list outside this component
    } catch (error) {
      console.error('Error fetching more messages:', error)
    } finally {
      loadingMore.value = false
    }
  }
}

// Initialize IntersectionObserver
onMounted(() => {
  if (sentinel.value) {
    intersectionObserver.value = new IntersectionObserver(handleIntersection, {
      root: null, // Default: viewport
      rootMargin: '0px',
      threshold: 1.0 // Trigger when the sentinel is fully visible
    })
    intersectionObserver.value.observe(sentinel.value)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (intersectionObserver.value && sentinel.value) {
    intersectionObserver.value.unobserve(sentinel.value)
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

.loading, .no-messages {
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