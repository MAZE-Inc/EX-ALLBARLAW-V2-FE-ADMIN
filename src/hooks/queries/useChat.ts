import { QUERY_KEY } from '@/constants/query'
import { chatService } from '@/services/chatService'
import { ChatListRequest } from '@/types/chatTypes'
import { useQuery } from '@tanstack/react-query'

export const useChatList = (request: ChatListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.CHAT_LIST, request],
    queryFn: () => chatService.getChatList(request),
  })
}

export default useChatList
