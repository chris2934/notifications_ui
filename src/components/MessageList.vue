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
        @click.stop="openMessage(message)"
      >
        <MessageItem :message="message" class="message-item" />
      </div>
      <div ref="sentinel" class="scroll-sentinel"></div>
    </div>
    <div v-if="loadingMore" class="loading-more">Loading more messages...</div>

    <!-- Full Message View Dialog -->
    <v-dialog v-model="isDialogOpen" max-width="500px">
      <!-- Added @click.stop to the card to prevent any clicks inside from propagating -->
      <v-card v-if="selectedMessage" @click.stop>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Message Detail</span>
          <!-- Added .stop to prevent closing the message panel when clicking the X -->
          <v-btn icon variant="text" @click.stop="isDialogOpen = false">
            <v-icon class="material-symbols-outlined">close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <div class="text-caption mb-3 text-medium-emphasis">
            {{ formatFullDate(selectedMessage.MessageBody.timestamp) }}
          </div>
          <div class="text-body-1 full-message-body">
            {{ selectedMessage.MessageBody.content }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- Added .stop to prevent closing the message panel when clicking Close -->
          <v-btn
            color="primary"
            variant="text"
            @click.stop="isDialogOpen = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed } from "vue"
import MessageItem from "./MessageItem.vue"
import { useMessageDialog } from "@/utils/useMessageDialog"
import { useInfiniteScroll } from "@/utils/useInfiniteScroll"
import { useDateFormatter } from "@/utils/useDateFormatter"

const props = defineProps({
  messages: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  fetchMoreMessages: { type: Function, required: true },
})

const { sentinel, loadingMore } = useInfiniteScroll(props.fetchMoreMessages)
const { isDialogOpen, selectedMessage, openMessage } = useMessageDialog()
const { formatFullDate } = useDateFormatter()

const sortedMessages = computed(() => {
  return [...props.messages].sort((a, b) => {
    const dateA = new Date(a.ReceivedAt || 0).getTime()
    const dateB = new Date(b.ReceivedAt || 0).getTime()
    return dateB - dateA
  })
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

.full-message-body {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
}
</style>
