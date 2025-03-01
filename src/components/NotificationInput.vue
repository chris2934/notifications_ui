<template>
  <div class="messaging-container">
    <div class="message-list">
      <div v-if="loading" class="loading">Loading messages...</div>
      <div v-else-if="!messages.length" class="no-messages">No messages yet</div>
      <div
          v-else
          v-for="message in messages"
          :key="message.MessageId"
          class="message-item"
      >
        <div class="message-content">
          {{ message.MessageBody.content }}
        </div>
        <div class="message-meta">
          <span class="timestamp">
            {{ formatTime(message.MessageBody.timestamp) }}
          </span>
          <span :class="['status', message.MessageBody.status.toLowerCase()]">
            {{ message.MessageBody.status }}
          </span>
        </div>
      </div>
    </div>

    <form ref="form" class="message-input" @submit.prevent="handleSubmit">
      <input
          v-model="newMessage"
          @keyup.enter="handleSubmit"
          placeholder="Type a message..."
          :disabled="sending"
      />
      <button
          type="submit"
          :disabled="!newMessage.trim() || sending"
      >
        {{ sending ? 'Sending...' : 'Send' }}
      </button>
    </form>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { generateClient } from 'aws-amplify/api'
import { gql } from 'graphql-tag'

const messages = ref([])
const newMessage = ref('')
const sending = ref(false)
const loading = ref(true)
let subscription = null

const client = generateClient({
  authMode: 'apiKey',
  authToken: import.meta.env.VITE_APPSYNC_API_KEY,
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

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  try {
    sending.value = true;
    const messageInput = {
      content: newMessage.value.trim(),
      metadata: {
        type: "NOTIFICATION",
        version: "1.0"
      },
      status: "SENT",
      timestamp: new Date().toISOString()
    };

    await client.graphql({
      query: sendMessageMutation,
      variables: {
        input: messageInput
      }
    });

    // Clear input
    newMessage.value = '';

  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    sending.value = false;
  }
}

const handleSubmit = async (event) => {
  event.preventDefault();
  await sendMessage();
}

const fetchMessages = async () => {
  try {
    loading.value = true;
    const response = await client.graphql({
      query: GET_MESSAGES,
      authMode: 'apiKey',
      authToken: import.meta.env.VITE_APPSYNC_API_KEY
    });
    // Get messages from response and ensure it's an array
    const fetchedMessages = response.data?.getMessages || [];

    // Filter and map valid messages
    messages.value = fetchedMessages
        .filter(msg => {
          // Validate message structure
          return msg &&
              msg.MessageId &&
              msg.ReceivedAt &&
              msg.MessageBody;
        })
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
        }));

    // Sort messages by timestamp if needed
    messages.value.sort((a, b) =>
        new Date(b.MessageBody.timestamp) - new Date(a.MessageBody.timestamp)
    );

  } catch (error) {
    console.error('Error fetching messages:', error);
    messages.value = [];
  } finally {
    loading.value = false;
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
// Make sure to wait for both operations
onMounted(async () => {
  await fetchMessages();

  // Set up subscription
  subscription = client.graphql({
    query: MESSAGE_SUBSCRIPTION
  }).subscribe({
    next: ({ data }) => {
      if (data?.onNewMessage) {
        // Add new message to the list
        messages.value = [...messages.value, data.onNewMessage];
        // Sort messages by timestamp
        messages.value.sort((a, b) =>
            new Date(b.MessageBody.timestamp) - new Date(a.MessageBody.timestamp)
        );
      }
    },
    error: (error) => {
      console.error('Subscription error:', error);
    }
  });
});

// Proper cleanup
onUnmounted(() => {
  try {
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }
  } catch (error) {
    console.error('Error cleaning up subscription:', error)
  }
})
</script>

<style scoped>
.messaging-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.message-list {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
}

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
  display: flex;
  justify-content: space-between;
}

.status {
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
}

.status.sent {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status.failed {
  background-color: #ffebee;
  color: #d32f2f;
}

.status.unknown {
  background-color: #f5f5f5;
  color: #666;
}

.message-input {
  display: flex;
  gap: 10px;
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

.loading, .no-messages {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
