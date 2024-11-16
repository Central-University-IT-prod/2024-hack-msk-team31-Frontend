<script setup>
import Workspace from '@/components/Workspace.vue'
import { userRole, userName } from '@/stores/user'
</script>

<template>
  <div class="productPage role-page">
    <div>Имя {{ userName }} и роль {{ userRole }}</div>

    <Workspace />
  </div>
</template>

<style scoped>
.role-page {
  margin: 0 2.5rem;
}
</style>
