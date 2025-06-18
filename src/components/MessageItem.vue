<template>
  <v-card
    :color="message.isRead ? 'surface' : 'surface-variant'"
    class="message-item mb-3"
    variant="flat"
  >
    <v-card-text>
      <div class="message-content text-body-1">
        {{ message.MessageBody.content }}
      </div>
      <div class="message-meta">
        <v-chip
          class="pa-0"
          color="medium-emphasis"
          size="x-small"
          variant="text"
        >
          {{ formatTime(message.MessageBody.timestamp) }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const formatTime = (timestamp) => {
  if (!timestamp) return "No time"
  try {
    return new Date(timestamp).toLocaleTimeString()
  } catch (error) {
    console.error("Error formatting time:", error)
    return "Invalid time"
  }
}
</script>

<style scoped>
.message-item {
  transition: background-color 0.2s ease;
}

.message-content {
  margin-bottom: 4px;
}

.message-meta {
  display: flex;
  justify-content: flex-end;
}
</style>
