<script setup>
import { useRouter } from 'vue-router'
import { userAccessToken, userLogin, userRole, userName } from '@/stores/user'

const router = useRouter()

const baseAccounts = [
  {
    role: 'Админ',
    login: () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImp0aSI6IjU2NzlmOGFlYThkZjQ2MjJlY2RlYzUwYmM4MDlkZmY5MTYyMGFjMWU0M2ExYmFmMjM4YjkxYmVhOTU2MDhiOGQifQ.8jAA4j1fGGv7E5N9WQyIqDOK287FP6VFyUvnzWLm2J0'
      userAccessToken.value = token
      localStorage.setItem('accessToken', token)
      const login = 'admin'
      userLogin.value = login
      const name = 'admin'
      userName.value = name
      localStorage.setItem('userName', name)
      router.push('/workspaces')
    },
  },
  {
    role: 'Аналитик',
    login: () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJqdGkiOiI0N2E3ODIyNjA0MDE3ZjczYmUxZWMxNTMyYTE1NjQyYjhlYjU1N2FlNTZmYTliMDdmNjBhY2MyMTI1MTgzODBhIn0.MjJq1p32dAiO-QHJuA7lUS39BHPRQB7YiYZ1_JWHdqg'
      userAccessToken.value = token
      localStorage.setItem('accessToken', token)
      const login = 'analyst'
      userLogin.value = login
      const name = 'analyst'
      userName.value = name
      localStorage.setItem('userName', name)
      router.push('/workspaces')
    },
  },
  {
    role: 'Главный редактор',
    login: () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE0LCJqdGkiOiJmNGYyNjc0ZDVmM2E4MWM3NDJjOWE4NjUxMDI3MWIyZjJkOTlmNzcyZGE4ZDRmZTZjN2RkZWQ4N2M3NzNkYjhmIn0.KQBuFMHd6Q3wF86qm5XeEXP2_53pB7Wo9uEmFfM6XvY'
      userAccessToken.value = token
      localStorage.setItem('accessToken', token)
      const login = 'main_editor'
      userLogin.value = login
      const name = 'main_editor'
      userName.value = name
      localStorage.setItem('userName', name)
      router.push('/workspaces')
    },
  },
  {
    role: 'Редактор',
    login: () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsImp0aSI6IjQ4YzIzZTI2ZGFlOTRjOTcwMzYyMDc5ZmY3YzIzNGJlZWIyMTVmOWY1NzM0MzFmNjJhMDIxZjIyMDJjOTJhMjcifQ.QMbf6XEPN7d5oy3ebe8S6ZXEFH7-dWkOA-Uh5PkgzDo'
      userAccessToken.value = token
      localStorage.setItem('accessToken', token)
      const login = 'editor'
      userLogin.value = login
      const name = 'editor'
      userName.value = name
      localStorage.setItem('userName', name)
      router.push('/workspaces')
    },
  },
  {
    role: 'Маркетолог',
    login: () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJqdGkiOiI0MzMyNGNlMzljYTE1ZTI2OTZjZjUwZWM4MGQ1Mzk4OWJlMmVmZjQzZWQwMzZlOTQ5Njc4ZmI2NDU3MjQzN2JlIn0.alnYLBkL9Z4REiRhKWB2P0Gcjbz8kBZarYmZUO_H-f0'
      userAccessToken.value = token
      localStorage.setItem('accessToken', token)
      const login = 'marketolog'
      userLogin.value = login
      const name = 'marketolog'
      userName.value = name
      localStorage.setItem('userName', name)
      router.push('/workspaces')
    },
  },
]
</script>

<template>
  <div class="title">Войти как:</div>
  <ul class="inline-flex flex-col gap">
    <button
      class="block"
      v-for="account in baseAccounts"
      :key="account.role"
      @click="account.login"
    >
      Аккаунт {{ account.role }}
    </button>
  </ul>
</template>

<style scoped>
.title {
  color: #fff;
  text-align: center;
  font-size: 1.5rem;
}

button {
  border: none;
  border-radius: 25px;
  background-color: #d9d9d9;
  padding: 1.25rem 2rem;
  margin-top: 1rem;
}
</style>
