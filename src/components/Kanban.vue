<script setup>
import { onMounted, ref } from 'vue'
import { apiUrl, sendAuthRequest } from '@/api.js'
import { useRoute } from 'vue-router'
import axios from 'axios'
import CustomDialog from './CustomDialog.vue'

const route = useRoute()

const show = ref(0)
const description = ref('')
const name = ref('')

const STAGE_NAMES = {
  write_task: 'Постановка задачи',
  editor: 'Написание текста',
  main_editor: 'Проверка главредом',
  analyst: 'Подбор ЦА',
  marketing: 'Маркетинг',
  approve: 'Утверждение',
}

const STAGES = ['write_task', 'editor', 'analyst', 'main_editor', 'marketing', 'approve']

const tasksForStages = ref({
  write_task: [],
  editor: [],
  analyst: [],
  main_editor: [],
  approve: [],
  marketing: [],
})

async function loadData() {
  sendAuthRequest('GET', apiUrl(`workspaces/${route.params.id}/tasks`)).then((response) => {
    if (response.success) {
      const _tfs = {}
      for (const stage of STAGES) {
        _tfs[stage] = []
        for (const task of response.data) {
          if (task.checks[stage] === 'in_progress' && !task.is_archived) _tfs[stage].push(task)
        }
      }
      _tfs["__done"] = []
      for (const task of response.data) {
        let accept = true;
        for (const stage of STAGES) {
          if (task.checks[stage] !== 'done' || task.is_archived) {
            accept = false;
            break;
          }
        }
        if (accept)
          _tfs["__done"].push(task)
      }
      tasksForStages.value = _tfs;
    }
  });
}

onMounted(async (e) => {
  await loadData()
})

async function createTask() {
  if (name.value == '') {
    return
  }
  const newTask = {
    name: name.value,
    description: description.value,
  }
  name.value = ''
  description.value = ''
  const response = await sendAuthRequest(
    'POST',
    apiUrl(`workspaces/${route.params.id}/tasks`),
    newTask,
  )
  console.log(response.data)
  if (response.success) {
    tasksForStages.value['write_task'].push(response.data)
  }
  location.reload()

  show.value = 0
}
</script>
<template>
  <div class="container">
    <CustomDialog :show="show" @switch="show = !show">
      <div style="display: flex; flex-direction: column; gap: 1rem" class="form-dialog">
        <div class="dialog-title">Введите название и описание</div>
        <div class="input-wrapper">
          <span class="input-pretext">Название:</span>
          <input type="text" class="dialog-input" placeholder="Название..." v-model="name" />
        </div>
        <div class="textarea-wrapper" style="align-items: start">

          <textarea v-model="description" placeholder="Описание" cols="20" rows="5" class="resize-none"></textarea>
        </div>
        <button type="button" @click="createTask" class="btn-enter"
          style="background-color: var(--green); color: var(--white)">
          Добавить
        </button>
      </div>
    </CustomDialog>
    <button class="w-8 h-8 p-0 flex justify-center items-center border-none text-white rounded-md cursor-pointer"
      style="background-color: var(--green)" @click="show = 1">
      <i class="pi pi-plus" style="font-size: 1.2rem"></i>
    </button>
    <div class="kanban-cols">
      <div class="kanban-col" v-for="colId in STAGES" :key="colId">
        <span class="kanban-title">{{ STAGE_NAMES[colId] }}</span>
        <br />
        <div v-if="colId in tasksForStages" v-for="task in tasksForStages[colId]" :key="task" class="kanban-card">
          <a :href="'/workspace/' + route.params.id + '/task/' + task.id + '/' + colId">
            #{{ task.id }}: {{ task.name }}
          </a>
        </div>
      </div>
      <div class="kanban-col">
        <span class="kanban-title">Готово к отправке</span>
        <br />
        <div class="kanban-card" v-for="task in tasksForStages['__done']" :key="task">
          <a :href="'/workspace/' + route.params.id + '/task/' + task.id + '/done'">
            #{{ task.id }}: {{ task.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.textarea-wrapper textarea {
  height: 15rem;
  width: 30rem;
  overflow-y: scroll;
  resize: none;
  border: none;
  background-color: var(--green);
  color: #fff;
  padding: 1.5rem;
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
}

.textarea-wrapper {
  width: 30rem;
  margin: 1rem;
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  margin-bottom: 2rem;
}

.kanban-cols {
  display: flex;
  overflow-x: scroll;
  height: 70vh;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
  padding: 1rem 2rem;
}

.kanban-title {
  margin-top: 1rem;
  font-size: 1.25rem;
  color: #fff;
}

.kanban-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-width: 250px;
  width: 300px;
  padding: 4px;
  overflow-y: scroll;
  height: 100%;
  background-color: var(--green);
  border-radius: 0.75rem;
}


.kanban-card {
  border-radius: 8px;
  padding: 8px;
  width: 90%;
  background-color: #fff;
  font-size: 18px;
  text-align: center;
  color: black;
}

.container {
  padding: 24px;
  width: 100%;
  max-width: 100%;
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
  gap: 10px;
}

.form-dialog {
  width: 35rem;
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
