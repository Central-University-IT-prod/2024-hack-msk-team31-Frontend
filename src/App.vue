<script setup>
import { RouterView } from 'vue-router'
import headerComp from './components/headerComp.vue';
import TaskDetailPage from './views/TaskDetailPage.vue';
</script>

<template>
  <headerComp />
  <RouterView />
  <!-- <TaskDetailPage /> -->
</template>

<style scoped></style>
