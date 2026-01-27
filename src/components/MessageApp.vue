<template>
  <div class="app-container">
    <div class="main-content">
      <!-- Content goes here -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import axios from "axios"
import { GET_MESSAGES } from "../graphql/queries"
import { sortMessagesByTimestamp } from "../utils/messageHelpers"
import { transformIncomingMessage } from "../utils/messageTransformer"

const props = defineProps({})

// API keys and endpoints
const apiKey = import.meta.env.VITE_API_KEY
const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT

// State
const messages = ref([])
const loading = ref(true)

const fetchMessages = async () => {
  try {
    loading.value = true
    const response = await axios.post(
      graphqlEndpoint,
      {
        query: GET_MESSAGES,
      },
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      },
    )
    const fetchedMessages = Array.isArray(response?.data?.data?.getMessages)
      ? response.data.data.getMessages
      : []

    messages.value = fetchedMessages
      .filter((msg) => msg?.MessageId && msg?.ReceivedAt && msg?.MessageBody)
      .map(transformIncomingMessage)
      .sort(sortMessagesByTimestamp)
  } catch (error) {
    console.error("Error fetching messages:", error)
    messages.value = []
  } finally {
    loading.value = false
  }
}

// Fetch messages on component mount
onMounted(fetchMessages)
</script>

<style scoped>
.app-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  margin-top: 80px;
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
