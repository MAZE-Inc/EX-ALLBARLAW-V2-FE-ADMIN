import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { FindAccountRequest } from '@/types/authTypes'
import { message } from 'antd'
import { AxiosError } from 'axios'

export const useFindAccountMutation = () => {
  return useMutation({
    mutationFn: (request: FindAccountRequest) => authService.findAccount(request),
    onSuccess: () => {
      message.success('입력하신 이메일로 아이디와 초기화된 비밀번호를 발송했습니다.')
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error.response?.data?.message || '계정 찾기에 실패했습니다.'
      message.error(errorMessage)
    },
  })
}
