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
    <button
        @click="handleSignOut"
        class="sign-out-btn"
        :disabled="isSigningOut"
    >
      {{ isSigningOut ? 'Signing out...' : 'Sign Out' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['send'])
const message = ref('')
const isSigningOut = ref(false)
const router = useRouter()
import { signOut } from 'aws-amplify/auth'
import {useRouter} from "vue-router";

const props = defineProps({
  sending: {
    type: Boolean,
    default: false
  }
})

const handleSubmit = async (event) => {
  event.preventDefault()
  if (message.value.trim()) {
    emit('send', message.value)
    message.value = ''
  }
}
const handleSignOut = async () => {
  try {
    await signOut();
    await router.push('/MessageLoginForm')
  } catch (error) {
    console.error('Logout failed:', error);
  }finally{
    isSigningOut.value = false
  }
}
</script>

<style scoped>
.sign-out-btn:hover {
  cursor: pointer;
}
.sign-out-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background-color: darkblue;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 100px; /* Prevents button size change when text changes */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 25px;
}

.sign-out-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.sign-out-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.message-input {
  display: flex;
  gap: 10px;
  margin-top: 200px;
  height: 50px;
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
