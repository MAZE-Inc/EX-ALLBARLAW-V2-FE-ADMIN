import instance from '@/lib/axios'
import { LawfirmList, LawfirmListRequest } from '@/types/lawfirmTypes'

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
}
