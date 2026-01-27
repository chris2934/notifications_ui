import { ref } from "vue"

export function useSubscriptions() {
  const subscriptions = ref([])
  const loading = ref(false)

  const toggleSubscription = (subscription) => {
    const index = subscriptions.value.findIndex((s) => s.id === subscription.id)
    if (index !== -1) {
      subscriptions.value[index].isActive = !subscriptions.value[index].isActive
    }
  }

  const loadSubscriptions = async () => {
    loading.value = true
    try {
      // Mock data - replace with actual API call
      subscriptions.value = [
        { id: 1, name: "Email Notifications", isActive: true },
        { id: 2, name: "Push Notifications", isActive: false },
        { id: 3, name: "SMS Notifications", isActive: true },
      ]
    } catch (error) {
      console.error("Error loading subscriptions:", error)
    } finally {
      loading.value = false
    }
  }

  return {
    subscriptions,
    loading,
    toggleSubscription,
    loadSubscriptions,
  }
}
