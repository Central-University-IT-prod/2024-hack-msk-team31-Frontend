import { createRouter, createWebHistory } from 'vue-router'
import StartPage from '@/views/StartPage.vue'
import TaskDetailPage from '@/views/TaskDetailPage.vue'
import WorkspacesPage from '../views/WorkspacesPage.vue'
import WorkspaceView from '../views/WorkspaceView.vue'
import axios from 'axios'
import { apiUrl, sendAuthRequest } from '../api'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: StartPage,
    },
    {
      path: '/workspaces',
      name: 'workspaces-page',
      component: WorkspacesPage,
    },
    // {
    //   path: '/product',
    //   name: 'product-page',
    //   component: productPage,
    // },
    // {
    //   path: '/redactor',
    //   name: 'redactor-page',
    //   component: RedactorPage,
    // },
    // {
    //   path: '/main-redactor',
    //   name: 'main-redactor-page',
    //   component: MainRedactorPage,
    // },
    {
      path: '/workspace/:id',
      name: 'workspace',
      component: WorkspaceView,
      props: true,
    },
    {
      path: '/workspace/:wid/task/:tid/:stageId',
      name: 'task',
      component: TaskDetailPage,
      props: true,
    },
  ],
})

router.beforeEach(async (to, from) => {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated && to.name !== 'login') {
    return { name: 'login' }
  }
  // const hasRole = checkRole()
  // if (!hasRole && to.name !== 'workspaces-page' && to.name !== 'login') {
  //   return { name: 'workspaces-page' }
  // }
})

async function checkAuth() {
  if (!localStorage.getItem('accessToken')) {
    return false
  }
  try {
    const { success } = await sendAuthRequest('GET', apiUrl('user/me'))
    if (!success) return false
    return true
  } catch (e) {
    console.log(e)
  }
}

function checkRole() {
  console.log(localStorage.getItem('userRole'))

  return !!localStorage.getItem('userRole')
}

export default router
