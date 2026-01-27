import { ref } from 'vue'

export function usePanelToggle() {
  const isMessageListOpen = ref(false)
  const isSettingsOpen = ref(false)
  
  const toggleMessages = (event) => {
    event?.stopPropagation()
    isMessageListOpen.value = !isMessageListOpen.value
    isMessageListOpen.value && (isSettingsOpen.value = false)
  }
  
  const toggleSettings = (event) => {
    event?.stopPropagation()
    isSettingsOpen.value = !isSettingsOpen.value
    isSettingsOpen.value && (isMessageListOpen.value = false)
  }
  
  return { isMessageListOpen, isSettingsOpen, toggleMessages, toggleSettings }
}