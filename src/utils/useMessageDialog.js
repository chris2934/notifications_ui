import { ref } from "vue"
import { markMessageAsRead } from "@/graphql/subscriptionClient.js"

export function useMessageDialog() {
  const isDialogOpen = ref(false)
  const selectedMessage = ref(null)

  const openMessage = async (message) => {
    if (!message) return

    selectedMessage.value = message
    isDialogOpen.value = true

    // Mark as read if necessary
    if (!message.isRead) {
      try {
        markMessageAsRead(message)
        message.isRead = true
      } catch (error) {
        console.error("Error marking message as read:", error)
      }
    }
  }

  const closeDialog = () => {
    isDialogOpen.value = false
    selectedMessage.value = null
  }

  return {
    isDialogOpen,
    selectedMessage,
    openMessage,
    closeDialog,
  }
}
