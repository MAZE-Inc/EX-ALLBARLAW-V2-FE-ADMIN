import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { message } from 'antd'
import { AdminCreateRequest } from '@/types/adminTypes'
import { adminService } from '@/services/adminService'
import { QUERY_KEY } from '@/constants/query'
import { AxiosError } from 'axios'

export const useCreateAdmin = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: AdminCreateRequest) => adminService.registerAdmin(credentials),
    onSuccess: (_data, _variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ADMIN_LIST, { skip: 0, take: 10 }] })
      message.success('관리자 계정이 등록되었습니다.')
      navigate(ROUTE_PATH.ADMIN_MANAGEMENT)
      onSuccess?.()
    },
    onError: (error: AxiosError) => {
      onError?.(error)
    },
  })
}
