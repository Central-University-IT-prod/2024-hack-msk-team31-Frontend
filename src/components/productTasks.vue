<template>
  <!-- <div class="task">
    <div>Техническое задание:</div>

    <textarea wrap="soft" name="" id="" placeholder="Введите тз">
            В связи с наступающими новогодними праздниками повысится спрос на игрушки, которыми мы торгуем. Запустив рекламу, нацеленную на родителей, мы поднимем прибыль stonks.
    </textarea>
    <div class="result">
      <div class="result-ad">
        <div>Текст:</div>
        <div>Невероятная реклама</div>
      </div>

      <button type="button">Скачать файл</button>
    </div>
    <div class="load_files">
      <input type="file" name="" id="" />
    </div>
  </div>

  <div class="btn-Send-to">

    <button type="button">Отправить</button>
  </div> -->
  <div>
    <div>Activity</div>
    <button type="button">Comments</button>
    <button type="button">Changes</button>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
textarea {
  width: 30rem;
  height: 15rem;
  overflow-y: scroll;
  resize: none;
}

.result {
  border: 1px solid black;
  width: 30rem;
  height: 17rem;
}

.result-ad {
  border: 2px solid black;
  width: 30rem;
  height: 15rem;
  overflow-y: hidden;
}

.dialog {
  background-color: var(--green);
}

.dialog-title {
  color: black;
  text-align: center;
  font-size: 1.5rem;

  margin-bottom: 2rem;
}

.btn {
  border: none;
  border-radius: 25px;
  background-color: #d9d9d9;
  padding: 1rem 2rem;
}

.input-wrapper {
  display: flex;
  flex-direction: row;
  width: 20rem;
}

.form-dialog {
  width: 30rem;
  height: 15rem;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.form-dialog-reg {
  height: 30rem;
  width: 40rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.form-dialog-reg .dialog-input {
  width: 18rem;
}

.form-dialog-reg .input-pretext {
  display: block;
  width: 10rem;
  text-align: end;
  padding-right: 1rem;
}

.form-dialog-reg .btn-enter {
  border: none;
  border-radius: 25px;
  background-color: var(--yellow);
  padding: 0.5rem 2.25rem;
}

.input-pretext {
  display: block;
  width: 5rem;
  text-align: end;
  padding-right: 1rem;
}

.dialog-input {
  border: 2px solid #d9d9d9;
}

.dialog-input:focus {
  outline: none;
}

.btn-enter {
  border: none;
  border-radius: 25px;
  background-color: var(--yellow);
  padding: 0.5rem 1.75rem;
}
</style>
