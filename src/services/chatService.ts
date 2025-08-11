import instance from '@/lib/axios'
import { ChatListRequest, ChatListResponse } from '@/types/chatTypes'

export const chatService = {
  getChatList: async (request: ChatListRequest) => {
    const { chatRoomPage, orderBy, sort, chatRoomStatus, searchQuery, searchType } = request

    // 쿼리 파라미터 객체 생성 (값이 있을 때만 포함)
    const params = new URLSearchParams()
    if (chatRoomPage !== undefined) params.append('chatRoomPage', chatRoomPage.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)
    if (sort !== undefined) params.append('sort', sort)
    if (chatRoomStatus !== undefined) params.append('chatRoomStatus', chatRoomStatus)
    if (searchQuery !== undefined) params.append('searchQuery', searchQuery)
    if (searchType !== undefined) params.append('searchType', searchType)

    const url = `/chatrooms${params.toString() ? `?${params.toString()}` : ''}`

    const response = await instance.get<ChatListResponse>(url)
    return response.data
  },
}
