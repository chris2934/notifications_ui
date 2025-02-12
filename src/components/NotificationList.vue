<template>
  <div class="notification-list">
    <h2>Notifications</h2>
    <ul>
      <li v-for="(notification, index) in notifications" :key="index">
        {{ notification }}
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
}
</style>