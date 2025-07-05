import { useQuery } from '@tanstack/react-query'
import { memberService } from '@/services/memberService'
import { MemberListRequest } from '@/types/memberType'

export const useGetMemberList = (request: MemberListRequest) => {
  return useQuery({
    queryKey: ['memberList', request],
    queryFn: () => memberService.getMemberList(request),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}
