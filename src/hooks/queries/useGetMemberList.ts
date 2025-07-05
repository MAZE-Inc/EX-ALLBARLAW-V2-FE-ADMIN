import { useQuery } from '@tanstack/react-query'
import { memberService } from '@/services/memberService'
import { MemberListRequest } from '@/types/memberType'
import { QUERY_KEY } from '@/constants/query'

export const useGetMemberList = (request: MemberListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.MEMBER_LIST, request],
    queryFn: () => memberService.getMemberList(request),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}
