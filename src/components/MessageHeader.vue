<template>
  <header class="sticky-header">
    <div class="header-content">
      <h1>Notifications</h1>
      <div class="header-icons">
        <!-- Notification Icon -->
        <div class="notification-icon" @click="toggleMessages($event)">
          <span
              class="material-symbols-outlined"
              :style="{ color: unreadCount > 0 ? 'red' : 'black' }"
          >
            {{ unreadCount > 0 ? 'notifications_unread' : 'notifications' }}
          </span>
        </div>
      </div>
    </div>
    <!-- Message Dropdown -->
    <div v-if="isMessageListOpen" ref="dropdown" class="message-dropdown">
      <MessageList
          :messages="messages"
          :loading="loading"
          @mark-as-read="handleMarkAsRead"
      />
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import MessageList from "./MessageList.vue";

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
const isMessageListOpen = ref(true); // Start with dropdown open by default

// Reference to the dropdown menu element
const dropdown = ref(null);

// Computed property for unread messages
const unreadCount = computed(
    () => props.messages.filter((message) => !message.isRead).length
);

// Toggle the dropdown open/close
const toggleMessages = (event) => {
  event.stopPropagation(); // Prevent event from triggering the "outside click" logic
  isMessageListOpen.value = !isMessageListOpen.value;

  if (isMessageListOpen.value) {
    addOutsideClickListener();
  } else {
    removeOutsideClickListener();
  }
};

// Handle marking messages as read when clicked (inside the dropdown)
const handleMarkAsRead = (clickedMessage) => {
  const message = props.messages.find((msg) => msg.id === clickedMessage.id);
  if (message) message.isRead = true;
};

// Detect clicks outside the dropdown
const handleClickOutside = (event) => {
  if (
      dropdown.value && // Ensure dropdown exists
      !dropdown.value.contains(event.target) && // Click is outside the dropdown
      event.target.closest(".notification-icon") === null // Click is NOT on the notification-icon
  ) {
    isMessageListOpen.value = false;
    removeOutsideClickListener();
  }
};

// Add the outside click listener
const addOutsideClickListener = () => {
  document.addEventListener("mousedown", handleClickOutside);
};

// Remove the outside click listener
const removeOutsideClickListener = () => {
  document.removeEventListener("mousedown", handleClickOutside);
};

// Automatically open the dropdown on mount
onMounted(() => {
  if (isMessageListOpen.value) {
    addOutsideClickListener();
  }
});

// Cleanup listeners when the component is destroyed
onBeforeUnmount(() => {
  removeOutsideClickListener();
});
</script>

<style scoped>
.header-icons {
  display: flex;
  gap: 1rem; /* Adds spacing between icons */
  align-items: center;
}

.notification-icon:hover {
  cursor: pointer;
}

.notification-icon .material-symbols-outlined {
  font-size: 36px;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
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
  justify-content: space-between; /* Keeps title and icons aligned on opposite sides */
  align-items: center;
  padding: 1rem 2rem; /* Padding around the header content */
  max-width: 1200px;
  margin: 0 auto; /* Center the content horizontally */
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
  z-index: 1000;
}

/* For smaller screens, reduce padding and adjust gaps */
@media (max-width: 768px) {
  .header-content {
    padding: 0.5rem 1rem;
  }

  .header-icons {
    gap: 0.5rem;
  }

  .message-dropdown {
    right: 1rem; /* Closer to the edge on smaller screens */
    width: 250px;
  }
}

/* For larger screens, extend padding for balance */
@media (min-width: 1440px) {
  .header-content {
    padding: 1rem 3rem;
  }

  .message-dropdown {
    right: 3rem; /* Further from the edge on larger screens */
  }
}
</style>