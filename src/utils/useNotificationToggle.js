import { ref } from "vue"
import subscribeToMessages from "@/graphql/subscriptionClient"
import { transformIncomingMessage } from "./messageTransformer"

export function useNotificationToggle(onMessageReceived) {
  const notificationsEnabled = ref(true)
  const messageSubscription = ref(null)

  const handleNotificationToggle = (value) => {
    notificationsEnabled.value = value
    if (value) {
      messageSubscription.value = subscribeToMessages((rawMessage) => {
        if (rawMessage) {
          const newMessage = transformIncomingMessage(rawMessage)
          onMessageReceived(newMessage)
        }
      })
    } else {
      messageSubscription.value?.unsubscribe()
      messageSubscription.value = null
    }
  }

  const cleanup = () => {
    messageSubscription.value?.unsubscribe()
  }

  return {
    notificationsEnabled,
    messageSubscription,
    handleNotificationToggle,
    cleanup,
  }
}
