<template>
  <header class="sticky-header">
    <div class="header-content">
      <h1>Notifications</h1>
      <div class="header-icons">
        <!-- Notification Icon -->
        <div class="notification-wrapper">
          <div class="notification-icon" @click="toggleMessages($event)">
            <span
              class="material-symbols-outlined"
              :style="{ color: unreadCount > 0 ? 'red' : 'black' }"
            >
              {{ unreadCount > 0 ? "notifications_unread" : "notifications" }}
            </span>
          </div>

          <!-- Message Dropdown -->
          <div v-if="isMessageListOpen" ref="dropdown" class="message-dropdown">
            <MessageList
              :messages="messages"
              :loading="loading"
              @mark-as-read="handleMarkAsRead"
              :fetch-more-messages="fetchMoreMessages"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

32;
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import MessageList from "./MessageList.vue"

// Props for the parent component
const props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// Function to fetch more messages
const fetchMoreMessages = async () => {
  try {
    console.log("Fetching more messages...")
    // Example: Add your API call or fetching logic here
    // Simulating fetch delay for example
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("More messages fetched.")
  } catch (error) {
    console.error("Error fetching more messages:", error)
  }
}

// Reactive state to track dropdown open/close status
const isMessageListOpen = ref(true) // Start with dropdown open by default

// Reference to the dropdown menu element
const dropdown = ref(null)

// Computed property for unread messages
const unreadCount = computed(
  () => props.messages.filter((message) => !message.isRead).length,
)

// Toggle the dropdown open/close
const toggleMessages = (event) => {
  event.stopPropagation() // Prevent event from triggering the "outside click" logic
  isMessageListOpen.value = !isMessageListOpen.value

  if (isMessageListOpen.value) {
    addOutsideClickListener()
  } else {
    removeOutsideClickListener()
  }
}

// Handle marking messages as read when clicked (inside the dropdown)
const handleMarkAsRead = (clickedMessage) => {
  const message = props.messages.find((msg) => msg.id === clickedMessage.id)
  if (message) message.isRead = true
}

// Detect clicks outside the dropdown
const handleClickOutside = (event) => {
  if (
    dropdown.value && // Ensure dropdown exists
    !dropdown.value.contains(event.target) && // Click is outside the dropdown
    event.target.closest(".notification-icon") === null // Click is NOT on the notification-icon
  ) {
    isMessageListOpen.value = false
    removeOutsideClickListener()
  }
}

// Add the outside click listener
const addOutsideClickListener = () => {
  document.addEventListener("mousedown", handleClickOutside)
}

// Remove the outside click listener
const removeOutsideClickListener = () => {
  document.removeEventListener("mousedown", handleClickOutside)
}

// Automatically open the dropdown on mount
onMounted(() => {
  if (isMessageListOpen.value) {
    addOutsideClickListener()
  }
})

// Cleanup listeners when the component is destroyed
onBeforeUnmount(() => {
  removeOutsideClickListener()
})
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
  position: relative; /* Use relative positioning for consistent alignment */
}

.header-icons {
  display: flex;
  align-items: center;
}

/* Notification Icon */
.notification-wrapper {
  position: relative; /* Ensure dropdown aligns correctly relative to this wrapper */
}

.notification-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.notification-icon .material-symbols-outlined {
  font-size: 36px; /* Maintain icon size consistency */
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 48;
}

/* Dropdown Styling */
.message-dropdown {
  position: absolute;
  top: calc(
    100% + 58px
  ); /* Start dropdown directly below the header with a gap */
  left: 50%; /* Center-align dropdown with the notification icon */
  transform: translateX(-50%);
  width: 300px;
  max-height: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1050;
  padding: 1rem 0;
}

/* Mobile-Friendly Adjustments */
@media (max-width: 768px) {
  .header-content {
    padding: 0.5rem 1rem;
  }

  .message-dropdown {
    width: 250px; /* Adjust dropdown width for smaller screens */
  }
}

/* Larger Screen Adjustments */
@media (min-width: 1440px) {
  .header-content {
    padding: 1rem 3rem;
  }

  .message-dropdown {
    width: 350px; /* Increase dropdown size for larger screens */
  }
}
</style>
