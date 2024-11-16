<script setup>
import { computed, onMounted, ref } from 'vue'
import { apiUrl, sendAuthRequest } from '@/api.js'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { dateConverter } from '@/utils.js'
const count = ref(0)
const isLoading = ref(true)
const route = useRoute()
const taskData = ref(null)
const comments = ref(null)
const activity = ref(null)
const rejectReasons = ref(null)
const taskDescFiles = ref(null)

const descFiles = ref([])
const descFilesProgress = ref(0)
const descFilesSuccess = ref(null)
const descFilesError = ref(null)

const contentFiles = ref([])
const contentFilesProgress = ref(0)
const contentFilesSuccess = ref(null)
const contentFilesError = ref(null)

const targetsFiles = ref([])
const targetsFilesProgress = ref(0)
const targetsFilesSuccess = ref(null)
const targetsFilesError = ref(null)

const newCommentModel = ref(null)

const descriptionModel = ref(null)
const contentModel = ref(null)
const subjectModel = ref(null)

const approveTextsTemplates = {
  product: 'Передвинуть в след. стадию',
  analyst: 'Отметить аналитику завершенной',
  main_editor: 'Согласовать текст',
  editor: 'Отправить текст на согласование',
  marketing: 'Согласовать аналитику по ЦА',
  '': '',
}

const currentRole = ref('')

const approveText = computed(() => {
  return approveTextsTemplates[currentRole.value]
})

const STAGE_NAMES = {
  write_task: 'Постановка задачи',
  editor: 'Написание текста',
  main_editor: 'Проверка главредом',
  analyst: 'Подбор ЦА',
  marketing: 'Маркетинг',
  approve: 'Утверждение',
}

const STAGES = ['write_task', 'editor', 'analyst', 'main_editor', 'marketing', 'approve']

const STATE_NAMES = {
  "not_started": "не начата",
  "in_progress": "в процессе",
  "done": "готово"
}

async function loadTaskData() {
  sendAuthRequest('GET', apiUrl(`tasks/${route.params.tid}`)).then((response) => {
    if (response.success) {
      taskData.value = response.data
      contentModel.value = taskData.value?.content
      descriptionModel.value = taskData.value?.description
      subjectModel.value = taskData.value?.subject
    }
  })

  sendAuthRequest('GET', apiUrl(`tasks/${route.params.tid}/comments`)).then((response) => {
    if (response.success) comments.value = response.data
  })

  sendAuthRequest('GET', apiUrl(`tasks/${route.params.tid}/history`)).then((response) => {
    if (response.success) activity.value = response.data
  })

  sendAuthRequest(
    'GET',
    apiUrl(`tasks/${route.params.tid}/reject-reasons/${route.params.stageId}`),
  ).then((response) => {
    if (response.success) rejectReasons.value = response.data
  })

  sendAuthRequest('GET', apiUrl(`tasks/${route.params.tid}/files`)).then((response) => {
    if (response.success) taskDescFiles.value = response.data
  })

  isLoading.value =
    comments.value !== null &&
    taskData.value !== null &&
    activity.value !== null &&
    rejectReasons.value !== null
}

function handleFileChange(event) {
  descFiles.value = Array.from(event.target.files)
  descFilesProgress.value = null // Reset progress
  descFilesSuccess.value = null // Reset error message
  descFilesError.value = false // Reset success message
}
function handleContentFileChange(event) {
  contentFiles.value = Array.from(event.target.files)
  contentFilesProgress.value = null // Reset progress
  contentFilesSuccess.value = null // Reset error message
  contentFilesError.value = false // Reset success message
}
function handleTargetsFileChange(event) {
  targetsFiles.value = Array.from(event.target.files)
  targetsFilesProgress.value = null // Reset progress
  targetsFilesSuccess.value = null // Reset error message
  targetsFilesError.value = false // Reset success message
}
async function uploadFiles() {
  if (descFiles.value.length === 0) {
    alert('Please select at least one file to upload.')
    return
  }

  const formData = new FormData()
  descFiles.value.forEach((file) => {
    formData.append('files', file)
  })

  sendAuthRequest(
    'PATCH',
    apiUrl(`tasks/${route.params.tid}/upload-file`),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    {
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent)
        descFilesProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      },
    },
  ).then((response) => {
    if (response.success) {
      console.log(response.data)
      descFilesSuccess.value = true
    } else {
      const error = response
      console.error(response.data)
      descFilesError.value = error.response ? error.response.data : 'Upload failed.'
    }
  })
}
async function uploadContentFiles() {
  if (contentFiles.value.length === 0) {
    alert('Please select at least one file to upload.')
    return
  }

  const formData = new FormData()
  contentFiles.value.forEach((file) => {
    formData.append('files', file)
  })

  sendAuthRequest(
    'PATCH',
    apiUrl(`tasks/${route.params.tid}/upload-content-file`),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    {
      onUploadProgress: (progressEvent) => {
        contentFilesProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      },
    },
  ).then((response) => {
    if (response.success) {
      console.log(response.data)
      contentFilesSuccess.value = true
    } else {
      const error = response
      console.error(response)
      contentFilesError.value = error.response ? error.response.data : 'Upload failed.'
    }
  })
}
async function uploadTargetsFiles() {
  if (targetsFiles.value.length === 0) {
    alert('Please select at least one file to upload.')
    return
  }

  const formData = new FormData()
  targetsFiles.value.forEach((file) => {
    formData.append('targets', file)
  })

  sendAuthRequest(
    "POST",
    apiUrl(`tasks/${route.params.tid}/import-targets`), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }, {
    onUploadProgress: (progressEvent) => {
      targetsFilesProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    }
  }).then(response => {
    if (response.success) {
      console.log(response.data);
      targetsFilesSuccess.value = true;
    } else {
      const error = response;
      console.error(response);
      targetsFilesError.value = error.response ? error.response.data : 'Upload failed.';
    }
  })
}

function submitComment() {
  if (newCommentModel.value) {
    sendAuthRequest('POST', apiUrl(`tasks/${route.params.tid}/comments`), {
      text: newCommentModel.value,
    }).then((response) => {
      if (response.success) location.reload()
    })
  }
}

function saveTask() {
  sendAuthRequest('PUT', apiUrl(`tasks/${route.params.tid}`), {
    name: taskData.value.name,
    description: descriptionModel.value,
    subject: subjectModel.value,
    content: contentModel.value,
  }).then((response) => {
    if (response.success) location.reload()
  })
}

function downloadFile(url, filename) {
  sendAuthRequest(
    'GET',
    apiUrl(url),
    {},
    {},
    {
      responseType: 'blob',
    },
  ).then((response) => {
    const blob = new Blob([response.data], { type: response.headers['content-type'] })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename || 'downloaded_file'
    console.log(blob)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  })
}

function deleteFile(id) {
  sendAuthRequest('DELETE', apiUrl(`tasks/${route.params.tid}/files/${id}`)).then((response) => {
    if (response.success) location.reload()
    else alert(response.reason)
  })
}

function approveTask() {
  sendAuthRequest(
    'POST',
    apiUrl(`tasks/${route.params.tid}/check/${route.params.stageId}/done?reject_reason=no`),
  ).then((response) => {
    if (response.success) window.location.href = `/workspace/${route.params.wid}`
    else alert(response.reason)
  })
}

function rejectTask(to) {
  sendAuthRequest(
    'POST',
    apiUrl(`tasks/${route.params.tid}/check/${route.params.stageId}/reject?reject_reason=${to}`),
  ).then((response) => {
    if (response.success) window.location.href = `/workspace/${route.params.wid}`
    else alert(response.reason)
  })
}

function massSend() {
  sendAuthRequest('POST', apiUrl(`tasks/${route.params.tid}/send`)).then((response) => {
    if (response.success) location.reload()
    else alert(response.reason)
  })
}

async function loadCurrentRole() {
  const response = await sendAuthRequest('GET', apiUrl(`workspaces/${route.params.wid}/members`))
  console.log(response.data)
  if (response.success) {
    const role = response.data.filter((member) => {
      return member.user.name === localStorage.getItem('userName')
    })[0].role
    console.log(role)
    currentRole.value = role
  }
}

onMounted(async (e) => {
  await loadTaskData()
  await loadCurrentRole()
})
</script>

<template>
  <div v-if="isLoading">
    <p>Loading</p>
  </div>
  <div v-else class="block">
    <button
      class="w-8 h-8 p-0 back-button border-none flex justify-center items-center rounded-md cursor-pointer"
      style="background-color: var(--yellow)"
      @click="$router.back()"
    >
      <i class="pi pi-caret-left" style="font-size: 1.3rem"></i>
    </button>
    <div class="task-header">
      <h2>{{ taskData.name }} / {{ STAGE_NAMES[$route.params.stageId] }} {{}}</h2>
      <div style="display: flex; height: 32px">
        <button style="margin-right: 32px" @click="saveTask" class="btn">Сохранить</button>
        <button @click="approveTask" class="btn-green">
          {{ approveText }}
        </button>
        <button
          v-for="reject in rejectReasons"
          @click="
            () => {
              rejectTask(reject.id)
            }
          "
          class="btn-send"
        >
          Вернуть на '{{ reject.name }}'
        </button>
      </div>
    </div>
    <div class="task">
      <div class="stretch-children">
        <h4>Задача</h4>
        <div class="textarea-wrapper">
          <textarea
            wrap="soft"
            name=""
            id=""
            placeholder="Введите тз"
            style="max-width: 100%; min-width: 100%; min-height: 200px"
            v-model="descriptionModel"
          ></textarea>
          <br />
          <div class="file-to-tz">
            <input type="file" @change="handleFileChange" multiple class="invisible" id="tz-file" />
            <label for="tz-file">Приложить файл</label>
          </div>
          <br />
        </div>
        <div class="files-list">
          <div class="file-card" v-for="file in taskDescFiles">
            <span>{{ file.name }}</span>
            <button
              @click="
                () => {
                  deleteFile(file.id)
                }
              "
              class="file-btn"
            >
              <i class="pi pi-trash"></i>
            </button>
            <button
              @click="
                () => {
                  downloadFile(`tasks/${route.params.tid}/files/${file.id}`, file.name)
                }
              "
              class="file-btn"
            >
              <i class="pi pi-arrow-down"></i>
            </button>
          </div>
        </div>
        <div style="display: flex">
          <button @click="uploadFiles" class="btn-width" style="margin-right: 16px">
            Загрузить
          </button>
          <div v-if="descFilesProgress !== null">
            <progress max="100" :value="descFilesProgress"></progress>
          </div>
        </div>

        <div v-if="descFilesError" style="color: red">
          <p>Ошибка: {{ descFilesError }}</p>
        </div>
        <div v-if="descFilesSuccess" style="color: green">
          <p>Успешно!</p>
        </div>
      </div>
      <div class="stretch-children">
        <h4>Текст рассылки</h4>
        <button @click="massSend" v-if="taskData.checks.approve === 'done'">
          Выполнить рассылку
        </button>
        <input
          type="text"
          name="subject"
          placeholder="Заголовок рассылки"
          v-model="subjectModel"
          class="dialog-input"
        />
        <br />
        <div class="textarea-wrapper">
          <textarea
            wrap="soft"
            name="content"
            id=""
            placeholder="Введите текст"
            v-model="contentModel"
          ></textarea>
          <br />
          <!--          <div class="file-to-tz">-->
          <!--            <input type="file" @change="handleContentFileChange" multiple class="invisible" id="ad-file" />-->
          <!--            <label for="ad-file">Приложить файл</label>-->
          <!--          </div>-->
        </div>
        <!--        <button @click="uploadContentFiles" class="btn-width">Загрузить</button>-->
        <!--        <div v-if="contentFilesProgress !== null">-->
        <!--           <progress max="100" :value="contentFilesProgress"></progress>-->
        <!--        </div>-->
        <!--        <div v-if="contentFilesError" style="color: red;">-->
        <!--          <p>Ошибка: {{ contentFilesError }}</p>-->
        <!--        </div>-->
        <!--        <div v-if="contentFilesSuccess" style="color: green;">-->
        <!--          <p>Успешно!</p>-->
        <!--        </div>-->
        <h4>Загрузить клиентов из CSV</h4>
        <div style="display: flex">
          <div class="btn-width" style="margin-right: 8px">
            <input type="file" @change="handleTargetsFileChange" class="invisible" id="ad-target" />
            <label for="ad-target">Приложить csv</label>
          </div>
          <button @click="uploadTargetsFiles" class="btn-width" style="margin-right: 8px">
            Сохранить
          </button>
          <div v-if="targetsFilesProgress !== null">
            <progress max="100" :value="targetsFilesProgress"></progress>
          </div>
        </div>

        <div v-if="targetsFilesError" style="color: red">
          <p>Ошибка: {{ targetsFilesError }}</p>
        </div>
        <div v-if="targetsFilesSuccess" style="color: green">
          <p>Успешно!</p>
        </div>
        <button
          @click="downloadTargetFiles"
          class="btn-width"
          style="width: 100% !important; margin-top: 8px"
        >
          Скачать рекламные цели
        </button>
      </div>
    </div>
    <hr style="margin-top: 16px" />
    <div class="activity">
      <div class="stretch-children">
        <h4>Комментарии</h4>
        <form @submit.prevent="submitComment" class="flex-col-cent">
          <label for="comment-field">Оставить комментарий:</label>
          <div class="textarea-activity">
            <textarea id="comment-field" v-model="newCommentModel" required> </textarea>
          </div>
          <button type="submit" class="btn-width">Отправить</button>
        </form>
        <div class="comment-list">
          <div v-for="comment in comments">
            <div class="comment">
              <p>{{ comment.author }} - {{ dateConverter(comment.createdAt) }}</p>
              <p>{{ comment.text }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="stretch-children">
        <h4>История активности</h4>
        <div class="comment-list">
          <div v-for="event in activity">
            <div class="comment">
              <p>{{ event.authorName }} - {{ dateConverter(event.createdAt) }}</p>
              <table>
                <tr v-if="event.data.name">
                  <td style="width: 20%">Имя</td>
                  <td>{{ event.data.name }}</td>
                </tr>
                <tr v-if="event.data.description">
                  <td style="width: 20%">Задача</td>
                  <td>{{ event.data.description }}</td>
                </tr>
                <tr v-if="event.data.subject">
                  <td style="width: 20%">Заголовок</td>
                  <td>{{ event.data.subject }}</td>
                </tr>
                <tr v-if="event.data.content">
                  <td style="width: 20%">Контент</td>
                  <td>{{ event.data.content }}</td>
                </tr>
                <tr v-if="event.data.checks">
                  <td style="width: 20%">Стадии</td>
                  <td>
                    <div v-for="stage in STAGES" >
                      <span v-if="event.data.checks[stage] !== event.prev.checks[stage]">
                        {{STAGE_NAMES[stage]}} - {{STATE_NAMES[event.data.checks[stage]]}}</span>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  max-height: 32rem;
  overflow-y: scroll;
  scrollbar-width: none;
}

.comment {
  background-color: #d9d9d9;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  padding: 8px;
}

.activity {
  margin-bottom: 5rem;
}

.invisible {
  display: none;
}

textarea:focus {
  outline: none;
}

.flex-col-cent {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.textarea-wrapper {
  width: 30rem;
  margin: 1rem;
  background-color: var(--gray);
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  margin-bottom: 2rem;
}

.textarea-activity {
  width: 30rem;
  height: 16rem;
  margin: 1rem;
  background-color: var(--green);
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
}

.textarea-activity textarea {
  height: 16rem;
  overflow-y: scroll;
  resize: none;
  border: none;
  background-color: var(--green);
  color: #fff;
  padding: 1.5rem;
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
}

.textarea-wrapper label {
  margin-left: 1.5rem;
  color: #fff;
  padding-bottom: 0.5rem;
  cursor: pointer;
}

.textarea-wrapper textarea {
  height: 15rem;
  overflow-y: scroll;
  resize: none;
  border: none;
  background-color: var(--green);
  color: #fff;
  padding: 1.5rem;
  border-top-left-radius: 0.75rem;
}

.btn-width {
  border: none;
  border-radius: 25px;
  background-color: #d9d9d9;
  padding: 0 1.5rem;
  width: 15rem !important;
  text-align: center;
  padding: 0.25rem 0;
}

.file-to-tz {
  display: flex;
  align-items: end;
  height: 3rem;
  background-color: var(--gray);
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
}

button {
  font-weight: bold;
}

.block {
  max-width: 100%;
  width: 100%;
  padding-left: 4rem;
}

.task,
.activity {
  display: flex;
}

.task *,
.activity * {
  width: 45%;
}

.stretch-children * {
  width: 100%;
}

.stretch-children {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.task-header {
  display: flex;
  justify-content: space-between;
  padding-right: 16px;
  border-bottom: 2px solid var(--green);
  margin-right: 0;
  align-items: center;
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
  padding: 0 1.5rem;
}

.btn-green {
  border: none;
  border-radius: 25px;
  background-color: var(--green);
  color: #fff;
  padding: 0 1.5rem;
}

.input-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 20rem;
}

.task,
.activity {
  display: flex;
  flex-direction: row;
  gap: 5rem;
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
  height: 1.5rem;
  border-top: none;
  border-left: none;
  border-right: none;
  font-size: 14px;
}

.dialog-input:focus {
  outline: none;
}

.btn-send {
  border: none;
  border-radius: 25px;
  background-color: var(--yellow);
  padding: 0 1.5rem;
  margin-left: 8px;
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

.file-card {
  display: flex;
}

.files-list {
  margin-bottom: 8px;
  margin-top: 8px;
}

.file-btn {
  margin-left: 8px;
  width: 48px;
  background: none;
  border: 1px solid transparent;
  border-radius: 8px;
}

.file-btn:hover {
  border: 1px solid black;
}

.file-btn:active {
  border: 1px dashed black;
}
</style>
