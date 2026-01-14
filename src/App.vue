<template>
  <v-app>
    <authenticator>
      <template v-slot="{ user, signOut }">
        <v-app-bar border density="compact" flat>
          <v-app-bar-title>Notifications</v-app-bar-title>
          <v-spacer></v-spacer>
          <v-chip class="mr-2" size="small" variant="text">
            {{ user.username }}
          </v-chip>
          <v-btn class="mr-2" size="small" variant="outlined" @click="signOut">
            Sign Out
          </v-btn>
        </v-app-bar>

        <v-main>
          <MessageApp />
        </v-main>
      </template>
    </authenticator>
  </v-app>
</template>

<script setup>
import { onMounted } from "vue"
import MessageApp from "./components/MessageApp.vue"
import "@aws-amplify/ui-vue/styles.css"
import { Authenticator } from "@aws-amplify/ui-vue"

onMounted(() => {
  document.title = "Notifications"
})
</script>

<style>
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
</style>
