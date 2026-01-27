<template>
  <div class="app-container">
    <div class="main-content">
      <!-- Content goes here -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { fetchMessagesFromAPI } from "../utils/messageApi"

const props = defineProps({})

// State
const messages = ref([])
const loading = ref(true)

const fetchMessages = async () => {
  try {
    loading.value = true
    messages.value = await fetchMessagesFromAPI()
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
