<script setup >
import WorkspaceMembers from '@/components/WorkspaceMembers.vue'
import WorkspaceTasks from '@/components/WorkspaceTasks.vue'
import { onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { userAccessToken } from '@/stores/user'
import Kanban from '@/components/Kanban.vue'

defineProps(['workspace'])

const menuType = ref('tasks')
const members = ref([])
const workspaceName = ref()
const workspaceOwnerId = ref()

const route = useRoute()

onMounted(async () => {
  loadWorkspaceData()
  members.value = await loadWorkspaceMembers()
})

async function loadWorkspaceData() {
  const token = localStorage.getItem('accessToken')

  try {
    const { data } = await axios.get(
      `https://{{sensitive_data}}/api/workspaces/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    workspaceName.value = data.name
    workspaceOwnerId.value = data.ownerId
  } catch (e) {
    console.log(e)
  }
}

async function loadWorkspaceMembers() {
  const token = localStorage.getItem('accessToken')

  try {
    const { data } = await axios.get(
      `https://{{sensitive_data}}/api/workspaces/${route.params.id}/members`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return data
  } catch (e) {
    console.log(e)
  }
}

async function addMember(member) {
  const token = localStorage.getItem('accessToken')

  try {
    const { data } = await axios.post(
      `https://{{sensitive_data}}/api/workspaces/${route.params.id}/grantAccess`,
      member,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    members.value = await loadWorkspaceMembers()
  } catch (e) {
    console.log(e)
  }
}

async function deleteMember(login) {
  const token = localStorage.getItem('accessToken')

  try {
    const { data } = await axios.post(
      `https://{{sensitive_data}}/api/workspaces/${route.params.id}/revokeAccess`,
      {
        login,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    members.value = members.value.filter((member) => member.user.login !== login)
  } catch (e) {
    console.log(e)
  }
}

function moveBottomBorder(event) {
  const actives = document.querySelectorAll('.active')
  for (let i = 0; i < actives.length; i++) {
    actives[i].classList.remove('active')
  }
  event.target.classList.add('active')
}
</script>
<template>
  <div class="workshop-radio">
    <input
      type="radio"
      class="invisible"
      name="workshop-menuType"
      value="tasks"
      v-model="menuType"
      checked
      id="tasks-radio"

    />
    <button type="button" class="sq-btn" @click="moveBottomBorder">
      <label for="tasks-radio" class="active">Tаски</label>
    </button>
    <input
      type="radio"
      class="invisible"
      name="workshop-menuType"
      value="members"
      v-model="menuType"
      id="members-radio"
    />
    <button type="button" class="sq-btn" @click="moveBottomBorder">
      <label for="members-radio">Участники</label>
    </button>
  </div>

  <div class="tasks" v-if="menuType === 'tasks'">
    <Kanban />
  </div>
  <div class="members" v-else-if="menuType === 'members'">
    <WorkspaceMembers :members="members" @deleteMember="deleteMember" @addMember="addMember" />
  </div>
</template>

<style scoped>
.sq-btn {
  border: none;
  background: none;
}

.tasks,
.members,
.workshop-radio {
  margin-left: 5rem;
}

.sq-btn label {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
}

.active {
  border-bottom: 2px solid var(--green);
}

.workshop-radio {
  margin-bottom: 1rem;
}

.sq-btn span {
  height: 1.5rem;
}

.invisible {
  display: none;
}
</style>
