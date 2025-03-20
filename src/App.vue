<template>
  <div id="app">
    <MessageApp />
  </div>
</template>


<script setup>
import { onMounted } from 'vue'
import MessageApp from './components/MessageApp.vue';

onMounted(() => {
  document.title = 'Notifications'
})
</script>

<style>
body {
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Helvetica, Arial, sans-serif;
}
header {
  padding: 1rem;
}
</style>
