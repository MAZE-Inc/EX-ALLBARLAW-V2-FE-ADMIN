//* external
import axios from 'axios'
import { TOKEN_KEY } from '@/constants/token'

//* internal

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API,
  headers: { 'Content-Type': 'application/json' },
})

//* request
instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
})

//* response
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // const { status } = error.response

    //* 에러핸들링
    return Promise.reject(error)
  }
)

export default instance
