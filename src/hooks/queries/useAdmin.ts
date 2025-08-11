import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { useNavigate } from 'react-router-dom'
import { AdminCreateRequest } from '@/types/adminTypes'
import { QUERY_KEY } from '@/constants/query'
import { ROUTE_PATH } from '@/routes/routePath'
import { message } from 'antd'

export const useAdminProfile = () => {
  return useQuery({
    queryKey: ['adminProfile'],
    queryFn: adminService.getAdminProfile,
  })
}

export const useUpdateAdmin = (adminId: number) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: AdminCreateRequest) => adminService.patchAdmin(adminId, credentials),
    onSuccess: (_data, _variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ADMIN_LIST, { skip: 0, take: 10 }] })
      message.success('관리자 계정이 수정되었습니다.')
      navigate(ROUTE_PATH.ADMIN_MANAGEMENT)
    },
    onError: (error: Error) => {
      console.error('수정 실패:', error)
      message.error('관리자 계정 수정에 실패했습니다.')
    },
  })
}
