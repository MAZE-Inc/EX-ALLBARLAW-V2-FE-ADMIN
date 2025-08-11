export type ChatRoomStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CONSULTING'
  | 'PARTIAL_LEFT'
  | 'REJECTED'
  | 'HIDE'
  | 'DELETED'

export type ChatListRequest = {
  chatRoomPage?: number
  orderBy?: 'userName' | 'chatRoomCount' | 'lastMessageAt' | 'firstChatRoomCreatedAt' | 'userId'
  sort?: 'asc' | 'desc'
  chatRoomStatus?: 'all' | 'active' | 'ended'
  searchQuery?: string
  searchType?: 'userName' | 'lawyerName'
}

export type ChatListResponse = {
  chatRoomList: {
    userName: string
    chatRooms: {
      chatRoomId: number
      lawyerId: number
      lawyerName: string
      userMessageCount: number
      lawyerMessageCount: number
      firstMessageAt: string
      lastMessageAt: string
      isEnded: boolean
      status: ChatRoomStatus
      createdAt: string
    }[]
  }[]
  chatRoomTotal: number
  chatRoomPage: number
  chatRoomTotalPages: number
}
