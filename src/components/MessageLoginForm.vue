<template>
  <div class="login-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Username</label>
        <input
            id="username"
            v-model="username"
            type="text"
            required
            autocomplete="username"
            :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            :disabled="loading"
        />
      </div>

      <!-- Reset Password Form -->
      <div v-if="isResetPassword" class="form-group">
        <label for="code">Verification Code</label>
        <input
            id="code"
            v-model="verificationCode"
            type="text"
            required
            :disabled="loading"
        />
        <label for="newPassword">New Password</label>
        <input
            id="newPassword"
            v-model="newPassword"
            type="password"
            required
            :minlength="8"
            :disabled="loading"
        />
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>

      <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="submit-button"
      >
        <span v-if="!loading">
          {{ isResetPassword ? 'Reset Password' : 'Login' }}
        </span>
        <span v-else class="loading-state">
          <span class="spinner"></span>
          Processing...
        </span>
      </button>

      <div class="forgot-password">
        <a href="#" @click.prevent="handleForgotPassword">
          {{ isResetPassword ? 'Back to Login' : 'Forgot Password?' }}
        </a>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {signIn, resetPassword, confirmResetPassword, signOut, getCurrentUser} from 'aws-amplify/auth'
import router from "@/router/index.js";

const username = ref('')
const password = ref('')
const newPassword = ref('')
const verificationCode = ref('')
const loading = ref(false)
const error = ref('')
const isResetPassword = ref(false)
const currentSignInData = ref(null)

const emit = defineEmits(['login-success'])

const isFormValid = computed(() => {
  if (isResetPassword.value) {
    return username.value && verificationCode.value && newPassword.value
  }
  return username.value && password.value
})

const handleForgotPassword = async () => {
  if (isResetPassword.value) {
    isResetPassword.value = false
    error.value = ''
    return
  }

  if (!username.value) {
    error.value = 'Please enter your username'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await resetPassword({ username: username.value })
    isResetPassword.value = true
    error.value = 'Check your email for the verification code'
  } catch (err) {
    console.error('Reset password error:', err)
    error.value = err.message || 'Failed to initiate password reset'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  error.value = ''
  loading.value = true

  try {
    // First check if there's already a signed-in user
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        // If there's a current user, sign them out first
        await signOut()
      }
    } catch (err) {
      // No user is signed in, proceed with sign in
    }
    if (isResetPassword.value) {
      await confirmResetPassword({
        username: username.value,
        confirmationCode: verificationCode.value,
        newPassword: newPassword.value
      })
      isResetPassword.value = false
      error.value = 'Password reset successful. Please login.'
      // Clear the reset password fields
      verificationCode.value = ''
      newPassword.value = ''
    } else {
      const { isSignedIn, nextStep } = await signIn({
        username: username.value,
        password: password.value,
        options: {
          authFlowType: "USER_SRP_AUTH"
        }
      })

      if (isSignedIn) {
        emit('login-success')
        // Clear form after successful login
        username.value = ''
        password.value = ''
        // Add router navigation here
        await router.push('/Messages')
      } else if (nextStep) {
        currentSignInData.value = { nextStep }
      }
    }
  } catch (err) {
    console.error('Authentication error:', err)
    error.value = err.message || 'Authentication failed'
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.forgot-password {
  margin-top: 1rem;
  text-align: center;
}

.forgot-password a {
  color: #666;
  text-decoration: none;
  font-size: 0.9em;
}

.forgot-password a:hover {
  text-decoration: underline;
}
.error-message {
  color: red;
  margin-bottom: 1rem;
  font-size: 0.9em;
}
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-top: 200px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  align-items: center;
  width: 100%;
}

label {
  display: block;
  font-weight: 500;
  color: #333;
  align-self: flex-start;
  margin-bottom: 0.5rem;
}

input {
  width: 400px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.submit-button {
  position: relative;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #dc3545;
  margin: 10px 0;
  text-align: center;
  font-size: 14px;
  padding: 8px;
  background-color: #fff5f5;
  border-radius: 4px;
}

.password-requirements {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

small {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}
</style>
