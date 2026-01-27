import { ref, computed } from "vue"
import { fetchMessagesFromAPI } from "./messageApi"
import { calculateUnreadCount } from "./messageHelpers"

export function useMessages() {
  const messages = ref([])
  const loading = ref(true)
  const unreadCount = computed(() => calculateUnreadCount(messages.value))

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

  const addMessage = (newMessage) => {
    messages.value = [newMessage, ...messages.value]
  }

  const fetchMoreMessages = async () => {
    // Placeholder for pagination
  }

  return {
    messages,
    loading,
    unreadCount,
    fetchMessages,
    addMessage,
    fetchMoreMessages,
  }
}
