<template>
  <div class="subscription-content">
    <h3>Subscriptions</h3>
    <div class="subscription-list">
      <!-- Loading state -->
      <div v-if="loading" class="subscription-loading">
        <span>Loading subscriptions...</span>
      </div>

      <!-- Subscription items -->
      <template v-else>
        <div
          v-for="subscription in subscriptions"
          :key="subscription.id"
          class="subscription-item"
          :class="{ 'subscription-active': subscription.isActive }"
        >
          <div class="subscription-item-content">
            <span class="subscription-name">{{ subscription.name }}</span>
            <span class="subscription-status">
              {{ subscription.isActive ? "Active" : "Inactive" }}
            </span>
          </div>
          <div class="subscription-actions">
            <button
              @click="handleToggleSubscription(subscription)"
              :class="{ 'btn-active': subscription.isActive }"
            >
              {{ subscription.isActive ? "Unsubscribe" : "Subscribe" }}
            </button>
          </div>
        </div>
      </template>

      <!-- Empty state -->
      <div
        v-if="!loading && subscriptions.length === 0"
        class="subscription-empty"
      >
        <span>No subscriptions available</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue"

const props = defineProps({
  subscriptions: {
    type: Array,
    required: true,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["toggle-subscription"])

const handleToggleSubscription = (subscription) => {
  emit("toggle-subscription", subscription)
}
</script>

<style scoped>
.subscription-content {
  padding: 1rem;
}

.subscription-content h3 {
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  font-size: 1.1rem;
}

.subscription-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.subscription-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f8f8f8;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.subscription-item:hover {
  background-color: #f0f0f0;
}

.subscription-item-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.subscription-name {
  font-weight: 500;
}

.subscription-status {
  font-size: 0.9rem;
  color: #666;
}

.subscription-actions button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.subscription-actions button:hover {
  background-color: #f0f0f0;
}

.subscription-actions button.btn-active {
  background-color: #e0e0e0;
  border-color: #ccc;
}

.subscription-loading,
.subscription-empty {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.subscription-active {
  border-left: 3px solid #4caf50;
}
</style>
