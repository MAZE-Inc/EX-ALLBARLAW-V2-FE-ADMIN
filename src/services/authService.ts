import apiClient from '@/lib/axios'
import { AuthResponse, FindAccountRequest, LoginCredentials } from '@/types/authTypes'

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
  return response.data
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post('/admin/login', credentials)
      return response.data
    } catch (error) {
      console.error(error)
      throw new Error('로그인에 실패했습니다.')
    }
  },
  findAccount: async (request: FindAccountRequest) => {
    const response = await apiClient.post('/admin/find-account', request)
    return response.data
  },
}
