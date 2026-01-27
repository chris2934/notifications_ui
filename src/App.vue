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
                getNotificationIcon(unreadCount)
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
import MessageApp from "./components/MessageApp.vue"
import MessageList from "./components/MessageList.vue"
import "@aws-amplify/ui-vue/styles.css"
import { Authenticator } from "@aws-amplify/ui-vue"
import { useNotificationToggle } from "./utils/useNotificationToggle"
import { usePanelToggle } from "./utils/usePanelToggle"
import { useMessages } from "./utils/useMessages"
import { useAppInitialization } from "./utils/useAppInitialization"
import { getNotificationIcon } from "./utils/iconHelpers"

const {
  messages,
  loading,
  unreadCount,
  fetchMessages,
  addMessage,
  fetchMoreMessages,
} = useMessages()

const { isMessageListOpen, isSettingsOpen, toggleMessages, toggleSettings } =
  usePanelToggle()

const { notificationsEnabled, handleNotificationToggle, cleanup } =
  useNotificationToggle(addMessage)

useAppInitialization(
  fetchMessages,
  notificationsEnabled,
  handleNotificationToggle,
  cleanup,
)
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
