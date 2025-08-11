import instance from '@/lib/axios'
import {
  LegalTermDetailResponse,
  LegalTermListRequest,
  LegalTermListResponse,
  LegalTermReportRequest,
  LegalTermReportResponse,
} from '@/types/legalTermTypes'

export const legalTermService = {
  getLegalTermList: async (request: LegalTermListRequest) => {
    const { page, searchQuery, searchType } = request

    const params = new URLSearchParams()
    if (page !== undefined) params.append('page', page.toString())
    if (searchQuery !== undefined) params.append('searchQuery', searchQuery)
    if (searchType !== undefined) params.append('searchType', searchType)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/legal-terms${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<LegalTermListResponse>(url)
    return response.data
  },

  getLegalTermReportList: async (request: LegalTermReportRequest) => {
    const { page, searchQuery, searchType, status } = request

    const params = new URLSearchParams()
    if (page !== undefined) params.append('page', page.toString())
    if (searchQuery !== undefined) params.append('searchQuery', searchQuery)
    if (searchType !== undefined) params.append('searchType', searchType)
    if (status !== undefined) params.append('status', status)

    const queryString = params.toString()
    const url = `/legal-terms/reports${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<LegalTermReportResponse>(url)
    return response.data
  },

  getLegalTermDetail: async (id: number) => {
    const response = await instance.get<LegalTermDetailResponse>(`/legal-terms/${id}`)
    return response.data
  },
}
