import { QUERY_KEY } from '@/constants/query'
import { memberService } from '@/services/memberService'
import { useQuery } from '@tanstack/react-query'

export const useGetTotalMemberPage = () => {
  return useQuery({
    queryKey: [QUERY_KEY.TOTAL_MEMBER_PAGE],
    queryFn: () => memberService.getTotalMemberPages(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}
