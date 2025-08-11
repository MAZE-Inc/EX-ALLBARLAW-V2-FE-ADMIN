import instance from '@/lib/axios'
import { LawyerListRequest, LawyerListResponse, LawyerSearchRequest, LawyerSearchResponse } from '@/types/lawyerTypes'

export const lawyerService = {
  searchLawyer: async (request: LawyerSearchRequest) => {
    const { searchQuery, searchType } = request

    const params = new URLSearchParams()
    if (searchQuery) params.append('searchQuery', searchQuery)
    if (searchType) params.append('searchType', searchType)

    const url = `/lawyers/search?${params.toString()}`

    const response = await instance.get<LawyerSearchResponse>(url)
    return response.data
  },
  getLawyerList: async (request: LawyerListRequest) => {
    const { lawyerPage, orderBy, sort } = request

    const params = new URLSearchParams()
    if (lawyerPage) params.append('lawyerPage', lawyerPage.toString())
    if (orderBy) params.append('orderBy', orderBy)
    if (sort) params.append('sort', sort)

    const url = `/lawyers?${params.toString()}`

    const response = await instance.get<LawyerListResponse>(url)
    return response.data
  },
}
