import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { AdminListRequest } from '@/types/adminTypes'
import { QUERY_KEY } from '@/constants/query'

export const useGetAdminList = (request: AdminListRequest) => {
  return useQuery({
    queryKey: [
      QUERY_KEY.ADMIN_LIST,
      {
        skip: request.skip,
        take: request.take,
        adminIsActive: request.adminIsActive,
        adminAccountTypeId: request.adminAccountTypeId,
        searchQuery: request.searchQuery,
        searchType: request.searchType,
        sortBy: request.sortBy,
        sortOrder: request.sortOrder,
      },
    ],
    queryFn: () => adminService.getAdminList(request),
  })
}
