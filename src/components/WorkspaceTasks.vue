<script>
export default {
  props: {
    role: {
      type: String,
    },
  },
}
</script>

<template>
  <!-- <div class="task">
    <div>Техническое задание:</div>

    <div class="tz">
      В связи с наступающими новогодними праздниками повысится спрос на игрушки, которыми мы
      торгуем. Запустив рекламу, нацеленную на родителей, мы поднимем прибыль stonks.
    </div>

    <div class="load_files">
      <button type="button">Скачать приложенный файл</button>
    </div>
  </div>

  <div class="btn-Send-to">
    <div v-if="role == 'analytic'">
      <button type="button">Вернуть продакту</button>
      <button type="button">Отправить менеджеру</button>
    </div>
  </div>

  <div v-if="role == 'analytic'">
    <button type="button">Скачать csv</button>
    <div>
      <label for="csv-input">Приложить csv</label><input type="file" name="" id="csv-input" />
    </div>
  </div> -->
  <div>
    <div>Activity</div>
    <button type="button">Comments</button>
    <button type="button">Changes</button>
  </div>
</template>

<style>
.tz {
  width: 30rem;
  height: 15rem;
  overflow-y: scroll;
  resize: none;
}
</style>
