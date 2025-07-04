import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { LoginCredentials } from '@/types/authTypes'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { message } from 'antd'
import { TOKEN_KEY } from '@/constants/token'

export const useLoginMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data, variables) => {
      const { remember } = variables

      console.log(data)

      if (remember) {
        localStorage.setItem(TOKEN_KEY, data.adminAccessToken)
      } else {
        sessionStorage.setItem(TOKEN_KEY, data.adminAccessToken)
      }

      console.log(data)

      message.success('로그인에 성공했습니다.')
      navigate(ROUTE_PATH.ADMIN_MANAGEMENT)
    },
    onError: (error: Error) => {
      console.error('로그인 실패:', error)
      message.error('아이디 또는 비밀번호가 일치하지 않습니다.')
    },
  })
}
