<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { userRole, userAccessToken } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const workspaceName = ref('')
const workspaces = ref([])
const show = ref(false)

const roles = ref([
  {
    name: 'product',
    title: 'Продакт',
  },
  {
    name: 'analyst',
    title: 'Аналитик',
  },
  {
    name: 'editor',
    title: 'Редактор',
  },
  {
    name: 'main_editor',
    title: 'Главный редактор',
  },
  {
    name: 'marketing',
    title: 'Маркетолог',
  },
])
const selectedRole = ref('blank')

onMounted(async () => {
  const token = localStorage.getItem('accessToken')
  try {
    const { data, status } = await axios.get(`https://{{sensitive_data}}/api/workspaces`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log(data)

    workspaces.value = data
  } catch (e) {
    console.log(e)
  }
})

function openWorkspace(workspace) {
  router.push({
    name: 'workspace',
    params: { id: workspace.id },
  })
}
function switchShow() {
  show.value = !show.value
}
async function addWorkspace() {
  const token = localStorage.getItem('accessToken')

  try {
    const { data, status } = await axios.post(
      'https://{{sensitive_data}}/api/workspaces',
      {
        name: workspaceName.value,
        myRole: selectedRole.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    console.log(data)

    workspaces.value.push({
      name: data.name,
      id: data.id,
      ownerId: data.ownerId,
    })
    switchShow()
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <CustomDialog :show="show" @switch="switchShow">
    <div class="column-dialog">
      <div class="dialog-title">Новый workspace</div>
      <div class="input-wrapper"><span class="input-pretext">Название:</span>
        <input type="text" placeholder="Название.." v-model="workspaceName" class="dialog-input" />
      </div>

      <select name="role" v-model="selectedRole">
        <option selected disabled value="blank" style="display: none;">Ваша роль в команде</option>
        <option v-for="role in roles" :key="role.name" :value="role.name">{{ role.title }}</option>
      </select>
      <button type="button" @click="addWorkspace">Отправить</button>
    </div>
  </CustomDialog>
  <button type="button" @click="switchShow" style="margin: 1rem 0 1.5rem 4rem;">Создать workspace</button>
  <h3 class="line">Список Workspac'ов</h3>
  <div v-if="workspaces.length > 0">
    <div class="workshop__list">
      <div class="workshop__item" v-for="workspace in workspaces" @click="openWorkspace(workspace)" :key="workspace.id">
        <div class="">{{ workspace.name }}</div>
      </div>
    </div>
  </div>
  <div v-else style="margin-left: 4rem">
    Workspac'ов пока нет! Скорее создайте его
  </div>

</template>

<style scoped>
.line {
  width: calc(100%-4rem);
  margin-left: 4rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--green);
}

.column-dialog {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workshop__list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  margin-left: 4rem
}

.workshop__item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem;
  width: 10rem;
  height: 3rem;
  color: #fff;
  font-size: 1.125rem;
  background-color: var(--green);
  border-radius: 1.5rem;
  cursor: pointer;
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
  padding: 0.75rem 1.25rem;
}

.input-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 20rem;
}

.form-dialog {
  width: 25rem;
  height: 16rem;
  padding: 3rem;
  display: flex;
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

.btn-send {
  border: none;
  border-radius: 25px;
  background-color: var(--yellow);
  padding: 0.5rem 1.75rem;
  width: 10rem;
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
</style>
