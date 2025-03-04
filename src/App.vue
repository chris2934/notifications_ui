<template>
  <div class="app-container">
    <header class="sticky-header">
      <div v-if="isAuthenticated" class="header-controls">
          <button @click="handleSignOut" class="sign-out-btn">
            Sign Out
          </button>
        </div>
    </header>

    <MessageLoginForm
        v-if="!isAuthenticated"
        @login-success="handleLoginSuccess"
    />

    <MessageApp
        v-else
        ref="notificationInputRef"
    />
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {getCurrentUser, signOut} from 'aws-amplify/auth'
import MessageLoginForm from './components/MessageLoginForm.vue'
import MessageApp from './components/MessageApp.vue'

const isAuthenticated = ref(false)
const notificationInputRef = ref(null)

const checkAuthState = async () => {
  try {
    await getCurrentUser()
    isAuthenticated.value = true
  } catch (error) {
    isAuthenticated.value = false
  }
}

const handleLoginSuccess = async () => {
  isAuthenticated.value = true
  // If you need to fetch messages after login
  if (notificationInputRef.value) {
    await notificationInputRef.value.fetchMessages()
  }
}

const handleSignOut = async () => {
  try {
    await signOut()
    isAuthenticated.value = false
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

// Check auth state when component mounts
checkAuthState()
</script>

<style scoped>
header {
  padding: 1rem;
}

.header-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}

.sign-out-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.sign-out-btn:hover {
  background-color: #e0e0e0;
}
</style>
