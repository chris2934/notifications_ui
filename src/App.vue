<template>
  <v-app>
    <authenticator>
      <template v-slot="{ user, signOut }">
        <v-app-bar border density="compact" flat>
          <v-app-bar-title>Notifications</v-app-bar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="toggleMessages">
            <v-badge
              :content="unreadCount"
              :value="unreadCount > 0"
              color="error"
            >
              <v-icon class="material-symbols-outlined">{{
                unreadCount > 0 ? "notifications_unread" : "notifications"
              }}</v-icon>
            </v-badge>
          </v-btn>
          <v-btn icon @click="toggleSettings">
            <v-icon class="material-symbols-outlined">settings</v-icon>
          </v-btn>
          <v-chip class="ml-2 mr-2" size="small" variant="text">
            {{ user.username }}
          </v-chip>
          <v-btn class="mr-2" size="small" variant="outlined" @click="signOut">
            Sign Out
          </v-btn>
        </v-app-bar>

        <v-main>
          <MessageApp />

          <!-- Sliding Panels -->
          <div class="panel-container">
            <!-- Notifications Panel -->
            <v-card
              v-if="isMessageListOpen"
              class="side-panel notifications-panel"
              elevation="4"
            >
              <div class="panel-header">
                <h2>Notifications</h2>
                <v-btn icon variant="text" @click="toggleMessages">
                  <v-icon class="material-symbols-outlined">close</v-icon>
                </v-btn>
              </div>
              <MessageList
                :fetch-more-messages="fetchMoreMessages"
                :loading="loading"
                :messages="messages"
              />
            </v-card>

            <!-- Settings Panel -->
            <v-card
              v-if="isSettingsOpen"
              class="side-panel settings-panel"
              elevation="4"
            >
              <div class="panel-header">
                <h2>Settings</h2>
                <v-btn icon variant="text" @click="toggleSettings">
                  <v-icon class="material-symbols-outlined">close</v-icon>
                </v-btn>
              </div>
              <v-card-text class="settings-content">
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon class="material-symbols-outlined"
                        >notifications</v-icon
                      >
                    </template>
                    <v-list-item-title>Toggle On/Off</v-list-item-title>
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
                </v-list>
              </v-card-text>
            </v-card>
          </div>
        </v-main>
      </template>
    </authenticator>
  </v-app>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import axios from "axios"
import MessageApp from "./components/MessageApp.vue"
import MessageList from "./components/MessageList.vue"
import "@aws-amplify/ui-vue/styles.css"
import { Authenticator } from "@aws-amplify/ui-vue"
import { GET_MESSAGES } from "./graphql/queries"
import { sortMessagesByTimestamp } from "./utils/messageHelpers"
import { useNotificationToggle } from "./utils/useNotificationToggle"
import { transformMessage } from "./utils/transformMessage"

const isMessageListOpen = ref(false)
const isSettingsOpen = ref(false)
const messages = ref([])
const loading = ref(true)
const unreadCount = computed(
  () => messages.value.filter((m) => !m.isRead).length,
)

const { notificationsEnabled, handleNotificationToggle, cleanup } =
  useNotificationToggle((newMessage) => {
    messages.value = [newMessage, ...messages.value].sort(
      sortMessagesByTimestamp,
    )
  })

// API keys and endpoints
const apiKey = import.meta.env.VITE_API_KEY
const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT

const fetchMessages = async () => {
  try {
    loading.value = true
    const response = await axios.post(
      graphqlEndpoint,
      { query: GET_MESSAGES },
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      },
    )
    const fetchedMessages = Array.isArray(response?.data?.data?.getMessages)
      ? response.data.data.getMessages
      : []

    messages.value = fetchedMessages
      .filter((msg) => msg?.MessageId && msg?.ReceivedAt && msg?.MessageBody)
      .map(transformMessage)
      .sort(sortMessagesByTimestamp)
  } catch (error) {
    console.error("Error fetching messages:", error)
    messages.value = []
  } finally {
    loading.value = false
  }
}

const fetchMoreMessages = async () => {
  // Placeholder function
}

const toggleMessages = () => {
  isMessageListOpen.value = !isMessageListOpen.value
  if (isMessageListOpen.value) isSettingsOpen.value = false
}

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value
  if (isSettingsOpen.value) isMessageListOpen.value = false
}

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
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200");

body {
  font-family:
    "SF Pro Text",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Helvetica,
    Arial,
    sans-serif;
}

header {
  padding: 1rem;
}

/* Optional: Center the login form on the page */
[data-amplify-authenticator] {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.panel-container {
  position: relative;
  height: 100%;
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

.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 48;
}
</style>
