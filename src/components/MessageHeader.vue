<template>
  <div class="app-container">
    <!-- Header -->
    <v-app-bar class="sticky-header" color="white" elevation="2" flat>
      <div class="header-content">
        <h1>My App</h1>
        <div class="header-icons">
          <v-btn class="header-icon" icon @click="toggleMessages($event)">
            <v-badge
              :content="unreadCount"
              :value="unreadCount > 0"
              color="error"
              location="top end"
            >
              <v-icon
                :color="unreadCount > 0 ? 'error' : 'default'"
                class="material-symbols-outlined"
                size="30"
              >
                {{ unreadCount > 0 ? "notifications_unread" : "notifications" }}
              </v-icon>
            </v-badge>
          </v-btn>
          <v-btn class="header-icon" icon @click="toggleSettings($event)">
            <v-icon class="material-symbols-outlined" size="30"
              >settings</v-icon
            >
          </v-btn>
        </div>
      </div>
    </v-app-bar>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Sliding Panels -->
      <div class="panel-container">
        <!-- Notifications Panel -->
        <v-card
          v-if="isMessageListOpen"
          ref="messagePanel"
          class="side-panel notifications-panel"
          elevation="4"
        >
          <div class="panel-header">
            <h2>Notifications</h2>
            <v-btn
              class="close-icon"
              elevation="0"
              icon
              variant="text"
              @click="toggleMessages($event)"
            >
              <v-icon class="material-symbols-outlined">close</v-icon>
            </v-btn>
          </div>
          <MessageList
            :fetch-more-messages="fetchMoreMessages"
            :loading="loading"
            :messages="messages"
            @mark-as-read="handleMarkAsRead"
          />
        </v-card>

        <!-- Settings Panel -->
        <v-card
          v-if="isSettingsOpen"
          ref="settingsPanel"
          class="side-panel settings-panel"
          elevation="4"
        >
          <div class="panel-header">
            <h2>Settings</h2>
            <v-btn
              class="close-icon"
              elevation="0"
              icon
              variant="text"
              @click="toggleSettings($event)"
            >
              <v-icon class="material-symbols-outlined">close</v-icon>
            </v-btn>
          </div>
          <v-card-text class="settings-content">
            <div class="settings-options">
              <v-list>
                <v-list-item class="settings-option">
                  <template v-slot:prepend>
                    <v-icon class="material-symbols-outlined"
                      >notifications
                    </v-icon>
                  </template>
                  <v-list-item-title>Notification Settings</v-list-item-title>
                </v-list-item>
                <v-list-item class="settings-option">
                  <template v-slot:prepend>
                    <v-icon class="material-symbols-outlined">person</v-icon>
                  </template>
                  <v-list-item-title>Account Settings</v-list-item-title>
                </v-list-item>
                <v-list-item class="settings-option">
                  <template v-slot:prepend>
                    <v-icon class="material-symbols-outlined">tune</v-icon>
                  </template>
                  <v-list-item-title>Preferences</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Your main app content goes here -->
      <div class="app-content">
        <!-- Main application content -->
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
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
  height: 100px;
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
  width: 100%;
}

.header-icons {
  display: flex;
  gap: 1rem;
}

.header-icon {
  width: 40px !important;
  height: 40px !important;
}

.material-symbols-outlined {
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
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  z-index: 900;
  overflow-y: auto;
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

.settings-content {
  padding: 1rem;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-option {
  border-radius: 8px;
  transition: background-color 0.2s;
}

/*.settings-option:hover {
  background-color: rgb(var(--v-theme-surface-variant));
}*/

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
