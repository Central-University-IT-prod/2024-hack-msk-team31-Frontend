import { userAccessToken } from '@/stores/user'
import axios from 'axios'

export function apiUrl(url) {
  return `https://{{sensitive_data}}/api/${url}`
}

export async function sendRequest(method, url, data = null, headers = {}, add) {
  try {
    const response = await axios({
      method: method,
      url: url,
      data: data,
      headers: headers,
      ...add
    })
    return {success: true, data: response.data, headers: response.headers};
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      reason: error.response?.data?.detail,
      errorCode: error.response?.data?.code,
      data: error
    };
  }
}

export async function sendAuthRequest(method, url, data = null, headers = {}, add) {
  headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
  console.log(headers)
  return sendRequest(method, url, data, headers, add)
}

export async function getUserData() {
  const token = localStorage.getItem('accessToken')

  try {
    const { data, status } = await axios.get('https://{{sensitive_data}}/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log(data)

    const id = data.id
    const name = data.name
    const login1 = data.login

    return {
      id,
      name,
      login1,
    }
  } catch (e) {
    console.log(e)
  }
}
