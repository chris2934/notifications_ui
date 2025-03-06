<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {getCurrentUser} from 'aws-amplify/auth'
import { onMounted } from 'vue'

const isAuthenticated = ref(false)

const checkAuthState = async () => {
  try {
    await getCurrentUser()
    isAuthenticated.value = true
  } catch (error) {
    isAuthenticated.value = false
  }
}


onMounted(() => {
  checkAuthState()
  document.title = 'Notifications'
})
</script>

<style>
body {
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Helvetica, Arial, sans-serif;
}
header {
  padding: 1rem;
}
</style>
