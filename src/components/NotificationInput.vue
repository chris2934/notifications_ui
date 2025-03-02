<template>
  <div class="messaging-container">
    <MessageList
        :messages="messages"
        :loading="loading"
    />
    <MessageInput
        :sending="sending"
        @send="sendMessage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { generateClient } from 'aws-amplify/api'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'

const messages = ref([])
const newMessage = ref('')
const sending = ref(false)
const loading = ref(true)
let subscription = null

const client = generateClient({
  authMode: 'userPool',
  disableStorage: true,
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

const sendMessage = async (content) => {
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
      query: sendMessageMutation,
      variables: {
        input: messageInput
      }
    })
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    sending.value = false
  }
}

const handleSubmit = async (event) => {
  event.preventDefault()
  await sendMessage()
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
        .map(msg => ({
          MessageId: msg.MessageId,
          ReceivedAt: msg.ReceivedAt,
          MessageBody: {
            content: msg.MessageBody.content || '',
            metadata: {
              type: msg.MessageBody.metadata?.type || 'NOTIFICATION',
              version: msg.MessageBody.metadata?.version || '1.0'
            },
            status: msg.MessageBody.status || 'UNKNOWN',
            timestamp: msg.MessageBody.timestamp || msg.ReceivedAt
          }
        }))

    messages.value.sort((a, b) =>
        new Date(b.MessageBody.timestamp) - new Date(a.MessageBody.timestamp)
    )
  } catch (error) {
    console.error('Error fetching messages:', error)
    messages.value = []
  } finally {
    loading.value = false
  }
}

const sendMessageMutation = `
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      MessageId
      ReceivedAt
      MessageBody {
        content
        metadata {
          type
          version
        }
        status
        timestamp
      }
    }
  }
`

const GET_MESSAGES = `
  query GetMessages {
    getMessages {
      MessageId
      ReceivedAt
      MessageBody {
        content
        metadata {
          type
          version
        }
        status
        timestamp
      }
    }
  }
`

const MESSAGE_SUBSCRIPTION = `
  subscription OnNewMessage {
    onNewMessage {
      MessageId
      ReceivedAt
      MessageBody {
        content
        metadata {
          type
          version
        }
        status
        timestamp
      }
    }
  }
`

onMounted(async () => {
  await fetchMessages()

  subscription = client.graphql({
    query: MESSAGE_SUBSCRIPTION
  }).subscribe({
    next: ({ data }) => {
      if (data?.onNewMessage) {
        messages.value = [...messages.value, data.onNewMessage]
        messages.value.sort((a, b) =>
            new Date(b.MessageBody.timestamp) - new Date(a.MessageBody.timestamp)
        )
      }
    },
    error: (error) => {
      console.error('Subscription error:', error)
    }
  })
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
  newMessage,
  sending,
  loading,
  handleSubmit,
  fetchMessages
})
</script>

<style scoped>
.messaging-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

</style>
