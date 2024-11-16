<script setup>
import { ref } from 'vue'
import BaseAccountsList from './BaseAccountsList.vue'
// import RegisterDialog from './RegisterDialog.vue'
import CustomDialog from './CustomDialog.vue'
import axios from 'axios'
import { userAccessToken, userName, userId, userLogin } from '@/stores/user'
import { apiUrl, getUserData, sendAuthRequest } from '@/api'
import { useRouter } from 'vue-router'
import { Toast, useToast } from 'primevue'

const loginVisible = ref(false)
const registerVisible = ref(false)

const login = ref('')
const password = ref('')
const name = ref('')
const notifEmail = ref(null)
const passwordRepeat = ref('')

const router = useRouter()

const toast = useToast()

const loginFunc = async (e) => {
  e.preventDefault()

  try {
    const { data, status } = await axios.post(
      'https://{{sensitive_data}}/api/user/login',
      {
        login: login.value,
        password: password.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    userAccessToken.value = data.accessToken
    localStorage.setItem('accessToken', data.accessToken)

    const { id, name, login1 } = await getUserData()

    userId.value = id
    userName.value = name
    userLogin.value = login1
    localStorage.setItem('userName', name)

    router.push('/workspaces')
  } catch (e) {
    console.log(e)

    if (e.response) {
      toast.add({ severity: 'error', detail: e.response.data.detail })
    }
  }
}

const registerFunc = async (e) => {
  e.preventDefault()

  try {
    const { data, status } = await axios.post(
      'https://{{sensitive_data}}api/user/register',
      {
        name: name.value,
        login: login.value,
        password: password.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const token = data.accessToken

    userAccessToken.value = token
    localStorage.setItem('accessToken', token)

    sendAuthRequest(
      'PATCH',
      apiUrl(`account/set-notification-email?email=${notifEmail.value}`),
    ).then((resp) => {
      console.log(resp)
    })

    const { id, login1 } = await getUserData()

    userId.value = id
    userName.value = name.value
    userLogin.value = login1
    localStorage.setItem('userName', name.value)

    router.push('/workspaces')
  } catch (e) {
    console.log(e)

    if (e.response) {
      toast.add({ severity: 'error', detail: e.response.data.detail })
    }
    console.log(e)
  }
}
</script>

<template>
  <Toast />
  <div class="mx-auto w-fit mt-4 flex flex-column">
    <div class="menu-all block">
      <BaseAccountsList />
    </div>
    <div class="block menu">
      <button class="block btn" @click="loginVisible = true">Авторизация</button>
      <CustomDialog :show="loginVisible" @switch="loginVisible = false">
        <form @submit="loginFunc" class="flex flex-col form-dialog">
          <div class="dialog-title">Авторизация</div>
          <div class="input-wrapper">
            <span class="input-pretext">Логин:</span>
            <input
              name="login"
              type="text"
              v-model="login"
              placeholder="Логин"
              class="dialog-input"
              required
            />
          </div>
          <div class="input-wrapper">
            <span class="input-pretext">Пароль:</span>
            <input
              name="password"
              type="password"
              v-model="password"
              placeholder="Пароль"
              class="dialog-input"
              required
            />
          </div>
          <button type="submit" class="btn-enter">Войти</button>
        </form>
      </CustomDialog>

      <button class="btn" style="display: block" @click="registerVisible = true">
        Регистрация
      </button>
      <CustomDialog :show="registerVisible" @switch="registerVisible = 0">
        <form @submit="registerFunc" class="flex flex-col form-dialog-reg">
          <div class="dialog-title">Введите данные для регистрации</div>
          <div class="input-wrapper">
            <span class="input-pretext">Полное имя</span
            ><input
              name="name"
              v-model="name"
              type="text"
              class="dialog-input"
              placeholder="Полное имя"
              required
            />
          </div>
          <div class="input-wrapper">
            <span class="input-pretext">Логин</span
            ><input
              name="login"
              v-model="login"
              type="text"
              class="dialog-input"
              placeholder="Логин"
              required
            />
          </div>
          <div class="input-wrapper">
            <span class="input-pretext">Email</span
            ><input
              name="email"
              v-model="notifEmail"
              type="text"
              class="dialog-input"
              placeholder="Email"
            />
          </div>
          <div class="input-wrapper">
            <span class="input-pretext">Пароль</span
            ><input
              name="password"
              v-model="password"
              type="password"
              class="dialog-input"
              placeholder="Пароль"
              required
            />
          </div>
          <div class="input-wrapper">
            <span class="input-pretext">Повторите пароль</span
            ><input
              name="repeatPassword"
              v-model="passwordRepeat"
              type="password"
              class="dialog-input"
              required
              placeholder="Повторите пароль"
            />
          </div>
          <button type="submit" @click="onFormSubmit" class="btn-enter">ОК</button>
        </form>
      </CustomDialog>
    </div>
  </div>
</template>

<style scoped>
.flex-column {
  display: flex;
  flex-direction: column;
}

.menu {
  background-color: var(--green);
  width: 30rem;
  height: 20rem;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  border-radius: 5rem;

  margin-bottom: 5rem;
}

.menu-all {
  background-color: var(--green);
  width: 30rem;
  height: 40rem;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  border-radius: 5rem;

  margin-bottom: 5rem;
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
