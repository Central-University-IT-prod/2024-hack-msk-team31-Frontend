
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
    <button type="button" class="sq-btn">
      <label for="tasks-radio"><span>Tаски</span></label>
    </button>
    <input
      type="radio"
      class="invisible"
      name="workshop-menuType"
      value="members"
      v-model="menuType"
      id="members-radio"
    />
    <button type="button" class="sq-btn">
      <label for="members-radio"><span>Участники</span></label>
    </button>
  </div>

    <div class="tasks" v-if="menuType == 'tasks'">
      <Kanban />
    </div>
    <div class="members" v-else-if="menuType == 'members'">
      <productMembers :members="members" @deleteMember="deleteMember" @addMember="addMember" />
    </div>
</template>

<script>
import productMembers from './productMembers.vue'
import productTasks from './productTasks.vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { userAccessToken } from '@/stores/user'
import Kanban from '@/components/Kanban.vue'

export default {
  components: { Kanban, productMembers, productTasks },

  setup() {
    const route = useRoute()

    onMounted(async () => {
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
        // Здесь можно обработать полученные данные воркспейса
      } catch (e) {
        console.log(e)
      }
    })
  },
  data() {
    return {
      menuType: 'tasks',
      members: [
        { id: 1, name: 'миша привет!!', role: 'Редактор' },
        { id: 2, name: 'мишаааааа', role: 'Аналитик' },
      ],
    }
  },
  props: {
    workshop: {
      type: Object,
    },
  },
  methods: {
    addMember(member) {
      this.members.push(member)
    },
    deleteMember(member) {
      const newMember = []
      for (const mem of this.members) {
        if (mem != member) {
          newMember.push(mem)
        }
      }

      this.members = newMember
    },
  },
}
</script>

<style scoped>
.sq-btn {
  border: none;
  background: none;
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
.sq-btn span {
  height: 1.5rem;
}

.invisible {
  display: none;
}
</style>
