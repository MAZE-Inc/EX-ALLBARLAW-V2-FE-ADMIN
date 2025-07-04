import apiClient from '@/lib/axios'
import { AuthResponse, LoginCredentials } from '@/types/authTypes'

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
  //   postNotice: async (notice: NoticePostRequest) => {
  //     try {
  //       const response = await instance.post('/notice', notice)
  //       return response.data
  //     } catch (error) {
  //       console.error('Failed to post notice:', error)
  //       throw error
  //     }
  //   },
}
