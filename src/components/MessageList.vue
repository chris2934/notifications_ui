<template>
  <div class="message-list">
    <div v-if="loading" class="loading">Loading messages...</div>
    <div v-else-if="!messages.length" class="no-messages">No messages yet</div>
    <div v-else class="messages-container">
      <div v-for="message in messages"
           :key="message.MessageId"
           class="message-wrapper"
           :class="{ 'unread': !message.isRead, 'read': message.isRead }"
           @click="markAsRead(message)">
        <MessageItem
            :message="message"
            class="message-item"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import MessageItem from './MessageItem.vue'
import {generateClient} from 'aws-amplify/api'
import {UPDATE_MESSAGE_READ_STATUS } from "@/graphql/queries.js"

const client = generateClient()

defineProps({
  messages: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

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
</script>
<style scoped>
.message-list {
  height: 100vh;
  overflow-y: hidden;
  background: transparent;
}

.loading, .no-messages {
  text-align: center;
  padding: 20px;
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

.unread {
  font-weight: bold
}
</style>


