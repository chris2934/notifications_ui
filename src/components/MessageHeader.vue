<template>
  <header class="sticky-header">
    <div class="header-content">
      <h1>Notifications</h1>
      <div class="header-icons">
        <div class="notification-icon" @click="toggleMessages">
      <span class="material-symbols-outlined" :class="{ 'has-unread': unreadCount }">
        {{ unreadCount ? 'notifications_unread' : 'notifications' }}
      </span>
        </div>
        <button @click="handleSignOut" class="sign-out-btn">
          Sign Out
        </button>
      </div>
    </div>
    <div v-if="isMessageListOpen" class="message-dropdown">
      <MessageList
          :messages="messages"
          :loading="loading"
      />
    </div>
  </header>
</template>

<script setup>
import {ref} from 'vue'
import MessageList from './MessageList.vue'

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  unreadCount: {
    type: Number,
    default: 0
  }
})

const isMessageListOpen = ref(false)

const toggleMessages = () => {
  isMessageListOpen.value = !isMessageListOpen.value
}
</script>
<style scoped>
.header-icons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  transform: translateX(100px);
}

/* Optional: Add some spacing between the icon and button */
.sign-out-btn {
  margin-left: 30px; /* This will push the button to the right */
}

:root {
  --notification-dot-color: #ff0000;
}

.notification-icon:hover {
  cursor: pointer;
}

.notification-icon .material-symbols-outlined {
  font-size: 36px;
  font-variation-settings: 'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48;
}

.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.message-dropdown {
  position: absolute;
  right: 2rem;
  top: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.notification-icon .has-unread {
  background: linear-gradient(currentColor, currentColor),
  linear-gradient(red, red);
  background-clip: text, text;
  -webkit-background-clip: text, text;
  color: transparent;
  font-variation-settings: 'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48;
}

</style>
