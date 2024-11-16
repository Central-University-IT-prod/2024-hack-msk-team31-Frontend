<script setup>
import { ref } from 'vue'
import CustomDialog from './CustomDialog.vue'

defineProps(['members'])

const emit = defineEmits(['addMember', 'deleteMember'])

const role = ref('Выберите роль')
const login = ref('')
const show = ref(0)

function deleteMember(member) {
  emit('deleteMember', member)
}

function addMember() {
  if (role.value == 'Выберите роль' || login.value == '') {
    return
  }
  const member = { login: login.value, role: role.value }
  login.value = ''
  role.value = 'Выберите роль'
  emit('addMember', member)
  show.value = 0
}
</script>

<template>
  <div>
    <button type="button" @click="show = 1" class="btn">Добавить участника</button>
    <CustomDialog :show="show" @switch="show = !show">
      <div style="display: flex; flex-direction: column; gap: 1rem" class="form-dialog">
        <div class="dialog-title">Введите логин и выберите роль</div>
        <div class="input-wrapper">
          <span class="input-pretext">Логин:</span
          ><input type="text" placeholder="Логин..." v-model="login" />
        </div>
        <select v-model="role">
          <option disabled class="invisible" selected>Выберите роль</option>
          <option value="product">Продакт</option>
          <option value="analyst">Аналитик</option>
          <option value="editor">Редактор</option>
          <option value="main_editor">Главный редактор</option>
          <option value="marketing">Маркетолог</option>
        </select>
        <button type="button" @click="addMember" class="btn-enter">Добавить</button>
      </div>
    </CustomDialog>
    <h3 style="border-bottom: 2px solid var(--green)">Список участников</h3>

    <div class="members__list">
      <div v-if="members.length == 0">Пока участники не добавлены</div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <td>Имя</td>
              <td>Роль</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.user.id">
              <td>{{ member.user.name }}</td>
              <td>{{ member.role }}</td>
              <td>
                <button type="button" @click="deleteMember(member.user.login)" class="cross-btn">
                  <img src="../assets/cross.svg" alt="" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cross-btn {
  border: none;
  background: none;
  padding: 0;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  color: #ff0000;
}

img {
  width: 2.5rem;
  height: 2.5rem;
}

table {
  border-collapse: collapse;
}

td {
  text-align: center;
}

tbody tr:nth-child(2n + 1) td {
  background-color: rgba(148, 149, 151, 0.25);
}

tr td:first-child {
  border-left: 0;
}

tr td:last-child {
  border-right: none;
}

thead tr td {
  border-top: none;
  padding-top: 0.75rem;
  height: 3.25rem;
}

table tr:last-child td {
  padding-bottom: 0.75rem;
  height: 3.25rem;
  border-bottom: none;
}

tr td:last-child {
  width: 3rem;
}

td {
  width: 12rem;
  height: 3rem;
  padding: 0.5rem;
  border: 2.5px solid var(--green);
}

.invisible {
  display: none;
}

select {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--green);
  color: #fff;
  text-align: center;
  padding: 0.75rem 0.5rem;
  border: none;
  border-radius: 1rem;
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
  align-items: center;
  width: 20rem;
}

.form-dialog {
  width: 25rem;
  height: 15rem;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-content: center;
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
  width: 4.7rem;
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
