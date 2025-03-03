<template>
  <header class="sticky-header">
    <div class="header-content">
      <h1>Notifications</h1>
      <div class="notification-bell" @click="toggleMessages">
        <span class="bell-icon">🔔</span>
        <span v-if="unreadCount" class="notification-badge">{{ unreadCount }}</span>
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
import { ref } from 'vue'
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

.notification-bell {
  position: relative;
  cursor: pointer;
  padding: 8px;
}

.bell-icon {
  font-size: 1.5rem;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  min-width: 18px;
  text-align: center;
}

.message-dropdown {
  position: absolute;
  right: 2rem;
  top: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
