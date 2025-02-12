<template>
  <div class="notification-input">
    <input
        type="text"
        v-model="message"
        placeholder="Enter notification message"
    />
    <button @click="sendMessage">Send Notification</button>
  </div>
</template>

<script>
export default {
  name: 'NotificationInput',
  data() {
    return {
      message: '',
    };
  },
  methods: {
    sendMessage() {
      if (!this.message.trim()) {
        alert('Message cannot be empty.');
        return;
      }
      this.$emit('sendNotification', this.message);
      this.message = ''; // Clear after sending
    },
  },
};
</script>

<style>
.notification-input {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
</style>