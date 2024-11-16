<script setup>
defineProps(['user'])
</script>

<template>
  <div class="flex gap-4">
    <p>{{ user.name }}</p>
    <button class="notif">Уведомления</button>
  </div>
  <hr />
</template>

<style scoped></style>
