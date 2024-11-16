<script setup>
import { ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'

const user = {
  name: 'Ivan Potapov',
  role: 'redactor',
}

const taskText = ref('Письмо для вот этого.')
const templateType = ref('text')
const template = ref()
const emailText = ref(templateType.value == 'text' ? template.value : 'Начальный текст')

function saveText() {}
</script>

<template>
  <AppHeader :user="user" />
  <p>{{ taskText }}</p>
  <textarea name="emailText" v-model="emailText"></textarea>
  <button @click="saveText">Сохранить</button>
</template>

<style scoped></style>
