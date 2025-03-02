<!-- MessageInput.vue -->
<template>
  <form ref="form" class="message-input" @submit.prevent="handleSubmit">
    <input
        v-model="message"
        @keyup.enter="handleSubmit"
        placeholder="Type a message..."
        :disabled="sending"
    />
    <button
        type="submit"
        :disabled="!message.trim() || sending"
    >
      {{ sending ? 'Sending...' : 'Send' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  sending: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send'])
const message = ref('')

const handleSubmit = async (event) => {
  event.preventDefault()
  if (message.value.trim()) {
    emit('send', message.value)
    message.value = ''
  }
}
</script>

<style scoped>
.message-input {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
