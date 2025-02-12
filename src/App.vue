<template>
  <div id="app">
    <header>
      <h1>AWS SNS Notification System</h1>
    </header>

    <main>
      <NotificationInput @sendNotification="sendNotification" />
      <NotificationList :notifications="notifications" />
    </main>
  </div>
</template>

<script>
import NotificationInput from './components/NotificationInput.vue';
import NotificationList from './components/NotificationList.vue';
import NotificationService from './services/NotificationService.js';

export default {
  name: 'App',
  components: { NotificationInput, NotificationList },
  data() {
    return {
      notifications: [], // Keeps track of received notifications
    };
  },
  methods: {
    // Call backend via NotificationService to send a message
    async sendNotification(message) {
      try {
        await NotificationService.sendNotification(message);
        alert('Notification sent successfully!');
      } catch (error) {
        console.error('Failed to send notification', error);
        alert('Failed to send notification.');
      }
    },
  },
  async created() {
    // Mock functionality: Fetch initial notifications (if stored in backend)
    this.notifications = await NotificationService.getNotifications();
  },
};
</script>

<style>
header {
  text-align: center;
  margin-bottom: 2rem;
}
main {
  width: 80%;
  margin: 0 auto;
}
</style>