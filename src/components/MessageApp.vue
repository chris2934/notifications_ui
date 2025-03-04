<template>
  <div class="app-container">
    <Header
        :messages="messages"
        :loading="loading"
        :unread-count="unreadCount"
        :mark-as-read="markAsRead"
    />
    <div class="main-content">
      <MessageInput
          :sending="sending"
          @send="sendMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { generateClient } from 'aws-amplify/api'
import Header from './MessageHeader.vue'
import MessageInput from './MessageInput.vue'
import {
  GET_MESSAGES,
  SEND_MESSAGE_MUTATION,
  MESSAGE_SUBSCRIPTION, UPDATE_MESSAGE_READ_STATUS
} from '../graphql/queries'
import { formatTimestamp, sortMessagesByTimestamp } from '../utils/messageHelpers'

// State
const messages = ref([])
const sending = ref(false)
const loading = ref(true)
let subscription = null

// Computed
const unreadCount = computed(() =>
    messages.value.filter(message => !message.isRead).length
)

// Client setup
const client = generateClient({
  authMode: 'userPool',
  disableStorage: true,
})

// Message handling
const transformMessage = (msg) => ({
  MessageId: msg.MessageId,
  ReceivedAt: msg.ReceivedAt,
  isRead: msg.isRead || false, // Add this line
  MessageBody: {
    content: msg.MessageBody.content || '',
    metadata: {
      type: msg.MessageBody.metadata?.type || 'NOTIFICATION',
      version: msg.MessageBody.metadata?.version || '1.0'
    },
    status: msg.MessageBody.status || 'UNKNOWN',
    timestamp: msg.MessageBody.timestamp || msg.ReceivedAt
  }
})

const markAsRead = async (messageId) => {
  try {
    const response = await client.graphql({
      query: UPDATE_MESSAGE_READ_STATUS,
      variables: {
        input: {
          MessageId: messageId,
          isRead: true
        }
      }
    })

    // Update local state
    messages.value = messages.value.map(msg =>
        msg.MessageId === messageId
            ? { ...msg, isRead: true }
            : msg
    )
  } catch (error) {
    console.error('Error marking message as read:', error)
  }
}



const sendMessage = async (content) => {
  if (!content?.trim()) return

  try {
    sending.value = true
    const messageInput = {
      content: content.trim(),
      metadata: {
        type: "NOTIFICATION",
        version: "1.0"
      },
      status: "SENT",
      timestamp: new Date().toISOString()
    }

    await client.graphql({
      query: SEND_MESSAGE_MUTATION,
      variables: { input: messageInput }
    })
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    sending.value = false
  }
}

const fetchMessages = async () => {
  try {
    loading.value = true
    const response = await client.graphql({
      query: GET_MESSAGES,
      authMode: 'userPool',
    })
    const fetchedMessages = response.data?.getMessages || []
    messages.value = fetchedMessages
        .filter(msg => msg?.MessageId && msg?.ReceivedAt && msg?.MessageBody)
        .map(transformMessage)
        .sort(sortMessagesByTimestamp)

  } catch (error) {
    console.error('Error fetching messages:', error)
    messages.value = []
  } finally {
    loading.value = false
  }
}

const setupMessageSubscription = () => {
  subscription = client.graphql({
    query: MESSAGE_SUBSCRIPTION
  }).subscribe({
    next: ({ data }) => {
      if (data?.onNewMessage) {
        messages.value = [
          ...messages.value,
          transformMessage(data.onNewMessage)
        ].sort(sortMessagesByTimestamp)
      }
    },
    error: (error) => console.error('Subscription error:', error)
  })
}

// Lifecycle hooks
onMounted(async () => {
  await fetchMessages()
  setupMessageSubscription()
})

onUnmounted(() => {
  if (subscription) {
    subscription.unsubscribe()
    subscription = null
  }
})

// Expose necessary methods and reactive references
defineExpose({
  messages,
  sending,
  loading,
  sendMessage,
  fetchMessages
})
</script>

<style scoped>
.app-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

.main-content {
  margin-top: 80px;
  padding: 1rem;
}
</style>
