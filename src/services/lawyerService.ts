import instance from '@/lib/axios'
import { LawyerSearchRequest, LawyerSearchResponse } from '@/types/lawyerTypes'

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
}
