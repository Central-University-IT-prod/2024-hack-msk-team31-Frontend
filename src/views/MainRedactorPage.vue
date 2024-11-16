<script setup>
import { reactive, ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

const user = {
  name: 'Ivan Potapov',
  role: 'redactor',
}

const taskText = ref('Письмо для вот этого.')
const emailText = ref('Какой-то текст')

const corrections = ref([
  {
    text: '',
  },
])

const changeHistory = reactive([
  {
    text: '123123',
    date: '22.01.2024',
  },
])

function createCorrection() {
  corrections.value.push({ text: 'Что добавить' })
}

function approveText() {}

function rejectText() {}

function deleteCorrection(correction) {
  corrections.value = corrections.value.filter((el) => el.text !== correction.text)
}
</script>

<template>
  <AppHeader :user="user" />
  <h2>Первичное ТЗ:</h2>
  <p>{{ taskText }}</p>
  <hr />
  <h3>Написанный редактором текст:</h3>
  <textarea v-model="emailText"></textarea>
  <label class="cursor-pointer">
    Выбрать шаблон
    <input type="file" class="hidden" />
  </label>
  <hr />
  <h3>Список правок:</h3>
  <ul>
    <li v-for="correction in corrections" :key="correction.text">
      <input type="text" placeholder="Текст правки" v-model="correction.text" />
      <button @click="deleteCorrection(correction)">X</button>
    </li>
  </ul>
  <button @click="createCorrection">Добавить правку</button>
  <hr />
  <h2>История изменений задачи:</h2>
  <ul>
    <li v-for="historyPoint in changeHistory" :key="historyPoint.text">{{ historyPoint.text }}</li>
  </ul>
  <hr />
  <div class="flex">
    <button @click="rejectText">Отклонить</button>
    <button @click="approveText">Согласовать</button>
  </div>
</template>

<style scoped></style>
