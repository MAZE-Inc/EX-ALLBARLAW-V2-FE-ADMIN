import { useQuery } from '@tanstack/react-query'
import { legalTermService } from '@/services/legalTermService'
import { LegalTermListRequest, LegalTermReportRequest } from '@/types/legalTermTypes'
import { QUERY_KEY } from '@/constants/query'

export const useLegalTermList = (request: LegalTermListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.LEGAL_TERM_LIST, request],
    queryFn: () => legalTermService.getLegalTermList(request),
  })
}

export const useLegalTermReportList = (request: LegalTermReportRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.LEGAL_TERM_REPORT_LIST, request],
    queryFn: () => legalTermService.getLegalTermReportList(request),
  })
}

export const useLegalTermDetail = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.LEGAL_TERM_DETAIL, id],
    queryFn: () => legalTermService.getLegalTermDetail(id),
  })
}
