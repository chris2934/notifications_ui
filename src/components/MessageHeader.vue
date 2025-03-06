<template>
  <header class="sticky-header">
    <div class="header-content">
      <h1>Notifications</h1>
      <div class="header-icons">
        <!-- Dynamically update icon color and type -->
        <div class="notification-icon" @click="toggleMessages">
          <span
              class="material-symbols-outlined"
              :style="{ color: unreadCount > 0 ? 'red' : 'black' }"
          >
            {{ unreadCount > 0 ? 'notifications_unread' : 'notifications' }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="isMessageListOpen" class="message-dropdown">
      <MessageList
          :messages="messages"
          :loading="loading"
          @mark-as-read="handleMarkAsRead"
      />
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue';
import MessageList from './MessageList.vue';

// Props for the parent component
const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// Reactive state to track dropdown open/close status
const isMessageListOpen = ref(false);

// Toggle dropdown (no longer marks messages as read automatically)
const toggleMessages = () => {
  isMessageListOpen.value = !isMessageListOpen.value;
};

// Computed unread count, updates dynamically when `messages` changes
const unreadCount = computed(() => {
  return props.messages.filter(message => !message.isRead).length;
});

// Mark a specific message as read when clicked in the dropdown
const handleMarkAsRead = (clickedMessage) => {
  const message = props.messages.find(msg => msg.id === clickedMessage.id);
  if (message) {
    message.isRead = true;
  }
};
</script>

<style scoped>
.header-icons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  transform: translateX(100px);
}

.notification-icon:hover {
  cursor: pointer;
}

/* Avoid hardcoding colors and rely on the dynamic binding */
.notification-icon .material-symbols-outlined {
  font-size: 36px;
  margin-right: 110px;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
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
</style>