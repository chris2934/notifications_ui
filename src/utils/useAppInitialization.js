import { onBeforeUnmount, onMounted } from "vue"

export function useAppInitialization(
  fetchMessages,
  notificationsEnabled,
  handleNotificationToggle,
  cleanup,
) {
  onMounted(() => {
    document.title = "Notifications"
    fetchMessages()
    if (notificationsEnabled.value) {
      handleNotificationToggle(true)
    }
  })

  onBeforeUnmount(() => {
    cleanup()
  })
}
