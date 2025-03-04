<template>
  <div class="message-list">
    <div v-if="loading" class="loading">Loading messages...</div>
    <div v-else-if="!messages.length" class="no-messages">No messages yet</div>
    <div v-else class="messages-container">
      <div v-for="message in messages"
           :key="message.MessageId"
           class="message-wrapper">
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
</script>
<style scoped>
.message-list {
  height: 400px;
  overflow-y: auto;
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
}

.message-wrapper:last-child {
  border-bottom: none;
}
</style>


