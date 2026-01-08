<template>
  <div ref="messageList" class="message-list">
    <div v-if="loading && props.messages.length === 0" class="loading">
      Loading messages...
    </div>
    <div v-else-if="!props.messages.length && !loading" class="no-messages">
      No messages yet
    </div>
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
      <div ref="sentinel" class="scroll-sentinel"></div>
    </div>
    <div v-if="loadingMore" class="loading-more">Loading more messages...</div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue"
import MessageItem from "./MessageItem.vue"
import { markMessageAsRead } from "@/graphql/subscriptionClient.js"

const props = defineProps({
  messages: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  fetchMoreMessages: { type: Function, required: true },
})

const sentinel = ref(null)
const intersectionObserver = ref(null)
const loadingMore = ref(false)

const sortedMessages = computed(() => {
  return [...props.messages].sort((a, b) => {
    const dateA = new Date(a.ReceivedAt || 0).getTime()
    const dateB = new Date(b.ReceivedAt || 0).getTime()
    return dateB - dateA
  })
})

const markAsRead = async (message) => {
  if (!message || message.isRead) return
  try {
    markMessageAsRead(message)
    message.isRead = true
  } catch (error) {
    console.error("Error marking message as read:", error)
  }
}

const handleIntersection = async (entries) => {
  const [entry] = entries
  if (entry.isIntersecting && !loadingMore.value) {
    try {
      loadingMore.value = true
      await props.fetchMoreMessages()
    } catch (error) {
      console.error("Error fetching more messages:", error)
    } finally {
      loadingMore.value = false
    }
  }
}

onMounted(() => {
  if (sentinel.value) {
    intersectionObserver.value = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 1.0,
    })
    intersectionObserver.value.observe(sentinel.value)
  }
})

onUnmounted(() => {
  if (intersectionObserver.value) {
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
