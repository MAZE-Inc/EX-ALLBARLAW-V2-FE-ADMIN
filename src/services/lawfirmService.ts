import instance from '@/lib/axios'
import { Lawfirm, LawfirmApiRequest, LawfirmList, LawfirmListRequest } from '@/types/lawfirmTypes'

export const lawfirmService = {
  getLawfirmList: async (request: LawfirmListRequest) => {
    const { lawfirmPage, searchQuery, lawfirmSearchType, lawfirmOrderBy, lawfirmSort } = request

    const params = new URLSearchParams()
    if (lawfirmPage) params.append('lawfirmPage', lawfirmPage.toString())
    if (searchQuery) params.append('searchQuery', searchQuery.toString())
    if (lawfirmSearchType) params.append('lawfirmSearchType', lawfirmSearchType)
    if (lawfirmOrderBy) params.append('lawfirmOrderBy', lawfirmOrderBy)
    if (lawfirmSort) params.append('lawfirmSort', lawfirmSort)

    const url = `/lawfirms${params.toString() ? `?${params.toString()}` : ''}`
    const response = await instance.get<LawfirmList>(url)
    return response.data
  },
  getLawfirm: async (lawfirmId: number) => {
    const response = await instance.get<Lawfirm>(`/lawfirms/${lawfirmId}`)
    return response.data
  },
  createLawfirm: async (request: LawfirmApiRequest) => {
    const response = await instance.post('/lawfirms', request)
    return response.data
  },
  updateLawfirm: async (lawfirmId: number, request: LawfirmApiRequest) => {
    const response = await instance.patch(`/lawfirms/${lawfirmId}`, request)
    return response.data
  },
}
