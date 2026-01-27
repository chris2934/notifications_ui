<template>
  <div class="header-actions">
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
      <v-icon class="material-symbols-outlined" size="30">settings</v-icon>
    </v-btn>
    <v-chip class="ml-2 mr-2" size="small" variant="text">
      {{ user.username }}
    </v-chip>
    <v-btn class="mr-2" size="small" variant="outlined" @click="signOut">
      Sign Out
    </v-btn>

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
                    >notifications</v-icon
                  >
                </template>
                <v-list-item-title>Notification Settings</v-list-item-title>
                <template v-slot:append>
                  <v-switch
                    v-model="notificationsEnabled"
                    color="primary"
                    density="compact"
                    hide-details
                    @update:model-value="handleNotificationToggle"
                  ></v-switch>
                </template>
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
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import MessageList from "./MessageList.vue"
import { useNotificationToggle } from "@/utils/useNotificationToggle"

const props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    required: true,
  },
  signOut: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(["update:messages"])

const isMessageListOpen = ref(false)
const isSettingsOpen = ref(false)
const messagePanel = ref(null)
const settingsPanel = ref(null)

const { notificationsEnabled, handleNotificationToggle, cleanup } =
  useNotificationToggle((newMessage) => {
    const updatedMessages = [newMessage, ...props.messages]
    emit("update:messages", updatedMessages)
  })

const unreadCount = computed(
  () => props.messages.filter((message) => !message.isRead).length,
)

const toggleMessages = (event) => {
  event.stopPropagation()
  isMessageListOpen.value = !isMessageListOpen.value
  isMessageListOpen.value && (isSettingsOpen.value = false)
}

const toggleSettings = (event) => {
  event.stopPropagation()
  isSettingsOpen.value = !isSettingsOpen.value
  isSettingsOpen.value && (isMessageListOpen.value = false)
}

const handleMarkAsRead = (clickedMessage) => {
  const message = props.messages.find((msg) => msg.id === clickedMessage.id)
  if (message) {
    emit("mark-message-read", clickedMessage.id)
  }
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
  if (notificationsEnabled.value) {
    handleNotificationToggle(true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
  cleanup()
})
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  margin-top: 20px;
  height: calc(100vh - 84px);
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
  top: 64px;
  right: 0;
  width: 350px;
  height: calc(100vh - 64px);
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

.app-content {
  flex: 1;
  padding: 2rem;
}

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
