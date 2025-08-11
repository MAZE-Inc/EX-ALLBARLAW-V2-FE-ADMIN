import { useQuery } from '@tanstack/react-query'
import { lawyerService } from '@/services/lawyerService'
import { LawyerListRequest, LawyerSearchRequest } from '@/types/lawyerTypes'
import { QUERY_KEY } from '@/constants/query'

export const useLawyerSearch = (request: LawyerSearchRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_SEARCH, request],
    queryFn: () => lawyerService.searchLawyer(request),
    enabled: !!request.searchQuery && request.searchQuery.trim().length > 0,
  })
}

export const useLawyerList = (request: LawyerListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_LIST, request],
    queryFn: () => lawyerService.getLawyerList(request),
  })
}
