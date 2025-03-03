<template>
  <div class="message-item">
    <div class="message-content">
      {{ message.MessageBody.content }}
    </div>
    <div class="message-meta">
      <span class="timestamp">
        {{ formatTime(message.MessageBody.timestamp) }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const formatTime = (timestamp) => {
  if (!timestamp) return 'No time'
  try {
    return new Date(timestamp).toLocaleTimeString()
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'Invalid time'
  }
}
</script>

<style scoped>
.message-item {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.message-content {
  margin-bottom: 5px;
}

.message-meta {
  font-size: 0.8em;
  color: #666;
}
</style>
