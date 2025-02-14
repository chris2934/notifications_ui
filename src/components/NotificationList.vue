<template>
  <div class="notification-list">
    <h2>Notifications</h2>
    <ul>
      <li v-for="notification in sortedNotifications" :key="notification.MessageId">
        {{ notification.MessageBody }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NotificationList',
  props: {
    notifications: {
      type: Array,
      required: true,
    },
  },
  computed: {
    sortedNotifications() {
      // Sort notifications by ReceivedAt in descending or ascending order
      return [...this.notifications].sort(
          (a, b) => new Date(b.ReceivedAt) - new Date(a.ReceivedAt) // Descending: Newest first
      );
    },

  }
};
</script>

<style>
.notification-list {
  text-align: center;
}
.notification-list ul {
  list-style: none;
  padding: 0;
}
.notification-list li {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 5px;
  color:black;
}
</style>