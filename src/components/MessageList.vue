<!-- MessageList.vue -->
<template>
  <div class="message-list">
    <div v-if="loading" class="loading">Loading messages...</div>
    <div v-else-if="!messages.length" class="no-messages">No messages yet</div>
    <MessageItem
        v-else
        v-for="message in messages"
        :key="message.MessageId"
        :message="message"
    />
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
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
}

.loading, .no-messages {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
