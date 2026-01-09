<template>
  <div class="message-wrapper mb-3">
    <v-card class="message-item" color="surface" variant="flat" width="100%">
      <v-card-text class="card-text-compact">
        <div
          :class="{ 'unread-text': !message.isRead }"
          class="message-content text-body-1"
        >
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
  </div>
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
.message-wrapper {
  padding: 8px 16px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
  background-color: transparent;
}

.message-wrapper:hover {
  background-color: #f9f9f9;
}

.message-item {
  width: 100%;
  background-color: transparent !important;
  box-shadow: none;
}

.card-text-compact {
  padding: 0 !important;
}

.message-content {
  margin-bottom: 2px;
  line-height: 1.2;
  /* Truncate text to 2 lines for the list preview */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-text {
  font-weight: bold;
}

.message-meta {
  display: flex;
  justify-content: flex-start;
}
</style>
