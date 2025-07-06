import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { AdminListRequest } from '@/types/adminTypes'
import { QUERY_KEY } from '@/constants/query'

export const useGetAdminList = (request: AdminListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.ADMIN_LIST, request],
    queryFn: () => adminService.getAdminList(request),
  })
}
