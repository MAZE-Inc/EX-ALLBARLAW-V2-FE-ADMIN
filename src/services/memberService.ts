import instance from '@/lib/axios'
import { MemberListRequest, MemberListResponse } from '@/types/memberType'

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
}
