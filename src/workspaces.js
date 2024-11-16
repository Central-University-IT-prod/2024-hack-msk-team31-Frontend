import axios from 'axios'

const BACKEND_URL = ''
const getWorkspaces = async (BACKEND_URL) => {
  try {
    const response = await axios.get('https://{{sensitive_data}}/api/workspaces', {
      headers: {
        'Content-Type': 'application/json',
        Autorization: `Bearer ${BACKEND_URL}`,
      },
    })
    const data = response.data
    console.log(data)

  } catch (error) {
    console.error('Ошибка при получении данных:', error)
    throw error
  }
}

export default getWorkspaces
