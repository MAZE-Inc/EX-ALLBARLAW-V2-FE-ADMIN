import instance from '@/lib/axios'
import {
  AdLawyer,
  AdLawyerUpdateRequest,
  LawyerActivity,
  LawyerBasicInfo,
  LawyerCareer,
  LawyerDetailResponse,
  LawyerListRequest,
  LawyerListResponse,
  LawyerSearchRequest,
  LawyerSearchResponse,
  LawyerUpdateRequest,
} from '@/types/lawyerTypes'
import axios from 'axios'

const userUrl = import.meta.env.VITE_USER_SERVER_API

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
  getLawyerDetail: async (lawyerId: number) => {
    const url = `${userUrl}/lawyer/detail/${lawyerId}`
    const response = await axios.get<LawyerDetailResponse>(url)
    return response.data
  },
  getLawyerBasicInfo: async (lawyerId: number) => {
    const response = await instance.get<LawyerBasicInfo>(`/lawyer/profile/${lawyerId}/basic-info`)
    return response.data
  },
  updateLawyerBasicInfo: async (lawyerId: number, data: LawyerUpdateRequest) => {
    const response = await instance.put(`/lawyer/profile/${lawyerId}/basic-info`, data)
    return response.data
  },
  getLawyerCareer: async (lawyerId: number) => {
    const response = await instance.get<{ lawyerCareers: LawyerCareer[] }>(`/lawyer/profile/${lawyerId}/career`)
    return response.data
  },
  updateLawyerCareer: async (lawyerId: number, data: LawyerCareer[]) => {
    const requestBody = {
      lawyerCareers: data,
    }
    const response = await instance.put(`/lawyer/profile/${lawyerId}/career`, requestBody)
    return response.data
  },
  getLawyerActivity: async (lawyerId: number) => {
    const response = await instance.get<{ lawyerActivities: LawyerActivity[] }>(`/lawyer/profile/${lawyerId}/activity`)
    return response.data
  },
  updateLawyerActivity: async (lawyerId: number, data: LawyerActivity[]) => {
    const requestBody = {
      lawyerActivities: data,
    }
    const response = await instance.put(`/lawyer/profile/${lawyerId}/activity`, requestBody)
    return response.data
  },
  getAdLawyerList: async ({ searchQuery }: { searchQuery?: string }) => {
    const params = new URLSearchParams()
    if (searchQuery) params.append('searchQuery', searchQuery)

    const url = `/lawyer-ads?${params.toString()}`

    const response = await instance.get<AdLawyer[]>(url)
    return response.data
  },
  getAdLawyerDetail: async (lawyerAdId: number) => {
    const response = await instance.get<AdLawyer>(`/lawyer-ads/${lawyerAdId}`)
    return response.data
  },
  createAdLawyer: async (data: AdLawyerUpdateRequest) => {
    // Ensure dates are Date objects for the API
    const requestData = {
      ...data,
      lawyerAdStartedAt: data.lawyerAdStartedAt instanceof Date ? data.lawyerAdStartedAt : new Date(data.lawyerAdStartedAt),
      lawyerAdFinishedAt: data.lawyerAdFinishedAt instanceof Date ? data.lawyerAdFinishedAt : new Date(data.lawyerAdFinishedAt),
    }
    const response = await instance.post('/lawyer-ads', requestData)
    return response.data
  },
  updateAdLawyer: async (lawyerAdId: number, data: AdLawyerUpdateRequest) => {
    // Ensure dates are Date objects for the API
    const requestData = {
      ...data,
      lawyerAdStartedAt: data.lawyerAdStartedAt instanceof Date ? data.lawyerAdStartedAt : new Date(data.lawyerAdStartedAt),
      lawyerAdFinishedAt: data.lawyerAdFinishedAt instanceof Date ? data.lawyerAdFinishedAt : new Date(data.lawyerAdFinishedAt),
    }
    const response = await instance.put(`/lawyer-ads/${lawyerAdId}`, requestData)
    return response.data
  },
}
