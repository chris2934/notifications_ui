<template>
  <div class="app-container">
    <!-- Header -->
    <header class="sticky-header">
      <div class="header-content">
        <h1>My App</h1>
        <div class="header-icons">
          <div class="header-icon" @click="toggleMessages($event)">
            <span
              class="material-symbols-outlined"
              :style="{ color: unreadCount > 0 ? 'red' : 'black' }"
            >
              {{ unreadCount > 0 ? "notifications_unread" : "notifications" }}
            </span>
          </div>
          <div class="header-icon" @click="toggleSettings($event)">
            <span class="material-symbols-outlined">settings</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Sliding Panels -->
      <div class="panel-container">
        <!-- Notifications Panel -->
        <div
          v-if="isMessageListOpen"
          ref="messagePanel"
          class="side-panel notifications-panel"
        >
          <div class="panel-header">
            <h2>Notifications</h2>
            <span
              class="material-symbols-outlined close-icon"
              @click="toggleMessages($event)"
            >
              close
            </span>
          </div>
          <MessageList
            :messages="messages"
            :loading="loading"
            @mark-as-read="handleMarkAsRead"
            :fetch-more-messages="fetchMoreMessages"
          />
        </div>

        <!-- Settings Panel -->
        <div
          v-if="isSettingsOpen"
          ref="settingsPanel"
          class="side-panel settings-panel"
        >
          <div class="panel-header">
            <h2>Settings</h2>
            <span
              class="material-symbols-outlined close-icon"
              @click="toggleSettings($event)"
            >
              close
            </span>
          </div>
          <div class="settings-content">
            <div class="settings-options">
              <div class="settings-option">
                <span class="material-symbols-outlined">notifications</span>
                <span>Notification Settings</span>
              </div>
              <div class="settings-option">
                <span class="material-symbols-outlined">person</span>
                <span>Account Settings</span>
              </div>
              <div class="settings-option">
                <span class="material-symbols-outlined">tune</span>
                <span>Preferences</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Your main app content goes here -->
      <div class="app-content">
        <!-- Main application content -->
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import MessageList from "./MessageList.vue"

const props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const isMessageListOpen = ref(false)
const isSettingsOpen = ref(false)
const messagePanel = ref(null)
const settingsPanel = ref(null)

const unreadCount = computed(
  () => props.messages.filter((message) => !message.isRead).length,
)

const toggleMessages = (event) => {
  event.stopPropagation()
  isMessageListOpen.value = !isMessageListOpen.value
  if (isMessageListOpen.value) {
    isSettingsOpen.value = false
  }
}

const toggleSettings = (event) => {
  event.stopPropagation()
  isSettingsOpen.value = !isSettingsOpen.value
  if (isSettingsOpen.value) {
    isMessageListOpen.value = false
  }
}

const handleMarkAsRead = (clickedMessage) => {
  const message = props.messages.find((msg) => msg.id === clickedMessage.id)
  if (message) message.isRead = true
}

const fetchMoreMessages = async () => {
  try {
    console.log("Fetching more messages...")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("More messages fetched.")
  } catch (error) {
    console.error("Error fetching more messages:", error)
  }
}

const handleClickOutside = (event) => {
  if (
    !event.target.closest(".side-panel") &&
    !event.target.closest(".header-icon")
  ) {
    isMessageListOpen.value = false
    isSettingsOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-icons {
  display: flex;
  gap: 1rem;
}

.header-icon {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.header-icon:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.header-icon .material-symbols-outlined {
  font-size: 30px;
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 48;
}

.main-content {
  margin-top: 64px;
  height: calc(100vh - 64px);
  position: relative;
  display: flex;
}

.panel-container {
  position: relative;
  height: 100%;
  margin-top: 20px;
}

.side-panel {
  position: fixed;
  top: 95px;
  right: 0;
  width: 350px;
  height: calc(100vh - 80px);
  background: white;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  z-index: 900;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.close-icon {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-icon:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.settings-content {
  padding: 1rem;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.settings-option:hover {
  background-color: #f5f5f5;
}

.app-content {
  flex: 1;
  padding: 2rem;
}

/* Media Queries */
@media (max-width: 768px) {
  .side-panel {
    width: 100%;
  }

  .header-content {
    padding: 0 1rem;
  }
}

@media (min-width: 1440px) {
  .side-panel {
    width: 400px;
  }
}
</style>
