import instance from '@/lib/axios'
import { ApiResponse } from '@/types/axiosType'
import { BlogCase } from '@/types/blogTypes'
import { KnowledgeItem } from '@/types/knowledgeType'
import {
  Lawyer,
  LawyerInfoListRequest,
  LawyerInfoListResponse,
  LawyerMemberListRequest,
  LawyerMemberListResponse,
  LawyerRegisterModifyRequest,
  LawyerRegisterModifyResponse,
} from '@/types/lawyerTypes'
import { LegalTermItem } from '@/types/legalTermTypes'
import { MemberKeepCountResponse, MemberListRequest, MemberListResponse } from '@/types/memberType'
import { VideoCase } from '@/types/videoTypes'

export const memberService = {
  getTotalMemberPages: async () => {
    try {
      const response = await instance.get('/users/pages')
      return response.data
    } catch (error) {
      console.error('Failed to post member:', error)
      throw error
    }
  },

  getMemberList: async (request: MemberListRequest) => {
    const { userPage, orderBy, userIsActive, sort } = request

    const params = new URLSearchParams()
    if (userPage !== undefined) params.append('userPage', userPage.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)
    if (userIsActive !== undefined) params.append('userIsActive', userIsActive)
    if (sort !== undefined) params.append('sort', sort)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/users${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<MemberListResponse>(url)

    return response.data
  },

  updateMemberStatus: async (userId: number, isActive: boolean, userBanReason?: string) => {
    console.log(userId, isActive, userBanReason)
    try {
      const response = await instance.put(`/users/${userId}/status`, {
        userIsActive: isActive,
        userBanReason,
      })
      return response.data
    } catch (error) {
      console.error('Failed to update member status:', error)
      throw error
    }
  },
  resetPassword: async (userId: number) => await instance.post(`/users/${userId}/reset-password`),

  memberKeepCount: async (userId: number) => {
    const response = await instance.get<MemberKeepCountResponse>(`/mypages/${userId}/counts`)
    return response.data
  },

  memberKeepBlogList: async (userId: number, cursor?: number, cursorId?: number, sort: 'asc' | 'desc' = 'asc') => {
    const params: any = {
      sort: sort,
    }
    if (cursor !== undefined && cursor !== null) params.cursor = cursor
    if (cursorId !== undefined && cursorId !== null) params.cursorId = cursorId

    console.log('memberKeepBlogList params:', { userId, cursor, cursorId, sort, params })

    const response = await instance.get<ApiResponse<BlogCase[]>>(`/mypages/${userId}/blog-cases`, { params })
    return response.data
  },
  memberKeepVideoList: async (userId: number, cursor?: number, cursorId?: number, sort: 'asc' | 'desc' = 'asc') => {
    const params: any = {
      sort: sort,
    }
    if (cursor !== undefined && cursor !== null) params.cursor = cursor
    if (cursorId !== undefined && cursorId !== null) params.cursorId = cursorId
    const response = await instance.get<ApiResponse<VideoCase[]>>(`/mypages/${userId}/video-cases`, { params })
    return response.data
  },
  memberKeepLegalKnowledgeList: async (
    userId: number,
    cursor?: number,
    cursorId?: number,
    sort: 'asc' | 'desc' = 'asc'
  ) => {
    const params: any = {
      sort: sort,
    }
    if (cursor !== undefined && cursor !== null) params.cursor = cursor
    if (cursorId !== undefined && cursorId !== null) params.cursorId = cursorId
    const response = await instance.get<ApiResponse<KnowledgeItem[]>>(`/mypages/${userId}/knowledge`, { params })
    return response.data
  },
  memberKeepLawyerList: async (userId: number, cursor?: number, cursorId?: number, sort: 'asc' | 'desc' = 'asc') => {
    const params: any = {
      sort: sort,
    }
    if (cursor !== undefined && cursor !== null) params.cursor = cursor
    if (cursorId !== undefined && cursorId !== null) params.cursorId = cursorId
    const response = await instance.get<ApiResponse<Lawyer[]>>(`/mypages/${userId}/lawyers`, { params })
    return response.data
  },
  memberKeepLegalDictionaryList: async (
    userId: number,
    cursor?: number,
    cursorId?: number,
    sort: 'asc' | 'desc' = 'asc'
  ) => {
    const params: any = {
      sort: sort,
    }
    if (cursor !== undefined && cursor !== null) params.cursor = cursor
    if (cursorId !== undefined && cursorId !== null) params.cursorId = cursorId
    const response = await instance.get<ApiResponse<LegalTermItem[]>>(`/mypages/${userId}/legal-terms`, { params })
    return response.data
  },
}

export const lawyerMemberService = {
  getLawyerdMemberList: async (request: LawyerMemberListRequest) => {
    const { lawyerPage, orderBy, sort } = request

    const params = new URLSearchParams()
    if (lawyerPage !== undefined) params.append('lawyerPage', lawyerPage.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)
    if (sort !== undefined) params.append('sort', sort)

    const response = await instance.get<LawyerMemberListResponse>(`/lawyers`, { params })
    return response.data
  },

  getLawyerInfoList: async (request: LawyerInfoListRequest) => {
    const { lawyerPage, orderBy, sort, state } = request

    const params = new URLSearchParams()
    if (lawyerPage !== undefined) params.append('lawyerPage', lawyerPage.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)
    if (sort !== undefined) params.append('sort', sort)
    if (state !== undefined && state !== 'all') params.append('state', state) // 'all'일 때는 파라미터를 보내지 않음

    const response = await instance.get<LawyerInfoListResponse>(`/lawyers/info`, { params })
    return response.data
  },

  updateLawyerRegister: async (lawyerId: number, request: LawyerRegisterModifyRequest) => {
    const response = await instance.patch<LawyerRegisterModifyResponse>(`/lawyers/${lawyerId}`, request)
    return response.data
  },
}
