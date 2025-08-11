import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'

export const useAdminProfile = () => {
  return useQuery({
    queryKey: ['adminProfile'],
    queryFn: adminService.getAdminProfile,
  })
}
