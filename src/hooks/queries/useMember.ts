import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { message } from 'antd'
import { memberService } from '@/services/memberService'
import { QUERY_KEY } from '@/constants/query'

interface UpdateMemberStatusParams {
  userId: number
  isActive: boolean
  userBanReason?: string
}

export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, isActive, userBanReason }: UpdateMemberStatusParams) =>
      memberService.updateMemberStatus(userId, isActive, userBanReason),
    onSuccess: () => {
      // 멤버 리스트 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MEMBER_LIST] })
    },
    onError: (error: Error) => {
      console.error('계정 상태 업데이트 실패:', error)
      message.error('계정 상태 업데이트에 실패했습니다.')
    },
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (userId: number) => memberService.resetPassword(userId),
    onSuccess: () => {
      message.success('비밀번호가 초기화되었습니다.')
    },
    onError: (error: Error) => {
      console.error('비밀번호 초기화 실패:', error)
      message.error('비밀번호 초기화에 실패했습니다.')
    },
  })
}

export const useMemberKeppBlogList = (userId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.MEMBER_KEEP_BLOG_LIST, userId],
    queryFn: () => memberService.memberKeepBlogList(userId),
    enabled: userId !== undefined,
    select: response => response?.data || [],
  })
}

export const useMemberKeppVideoList = (userId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.MEMBER_KEEP_VIDEO_LIST, userId],
    queryFn: () => memberService.memberKeepVideoList(userId),
    enabled: userId !== undefined,
    select: response => response?.data || [],
  })
}

export const useMemberKeppLegalKnowledgeList = (userId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.MEMBER_KEEP_LEGAL_KNOWLEDGE_LIST, userId],
    queryFn: () => memberService.memberKeepLegalKnowledgeList(userId),
    enabled: userId !== undefined,
    select: response => response?.data || [],
  })
}

export const useMemberKeppLegalDictionaryList = (userId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.MEMBER_KEEP_LEGAL_DICTIONARY_LIST, userId],
    queryFn: () => memberService.memberKeepLegalDictionaryList(userId),
    enabled: userId !== undefined,
    select: response => response?.data || [],
  })
}

export const useMemberKeppLawyerList = (userId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.MEMBER_KEEP_LAWYER_LIST, userId],
    queryFn: () => memberService.memberKeepLawyerList(userId),
    enabled: userId !== undefined,
    select: response => response?.data || [],
  })
}

// 무한 스크롤용 훅들
export const useInfiniteMemberKeepBlogList = (userId: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.MEMBER_KEEP_BLOG_LIST, 'infinite', userId],
    queryFn: ({ pageParam }) => memberService.memberKeepBlogList(userId, pageParam?.cursor, pageParam?.cursorId),
    getNextPageParam: lastPage => {
      if (lastPage?.hasNextPage) {
        return {
          cursor: lastPage.nextCursor,
          cursorId: lastPage.nextCursorId,
        }
      }
      return undefined
    },
    enabled: userId !== undefined,
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
  })
}

export const useInfiniteMemberKeepVideoList = (userId: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.MEMBER_KEEP_VIDEO_LIST, 'infinite', userId],
    queryFn: ({ pageParam }) => memberService.memberKeepVideoList(userId, pageParam?.cursor, pageParam?.cursorId),
    getNextPageParam: lastPage => {
      if (lastPage?.hasNextPage) {
        return {
          cursor: lastPage.nextCursor,
          cursorId: lastPage.nextCursorId,
        }
      }
      return undefined
    },
    enabled: userId !== undefined,
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
  })
}

export const useInfiniteMemberKeepLegalKnowledgeList = (userId: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.MEMBER_KEEP_LEGAL_KNOWLEDGE_LIST, 'infinite', userId],
    queryFn: ({ pageParam }) =>
      memberService.memberKeepLegalKnowledgeList(userId, pageParam?.cursor, pageParam?.cursorId),
    getNextPageParam: lastPage => {
      if (lastPage?.hasNextPage) {
        return {
          cursor: lastPage.nextCursor,
          cursorId: lastPage.nextCursorId,
        }
      }
      return undefined
    },
    enabled: userId !== undefined,
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
  })
}

export const useInfiniteMemberKeepLawyerList = (userId: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.MEMBER_KEEP_LAWYER_LIST, 'infinite', userId],
    queryFn: ({ pageParam }) => memberService.memberKeepLawyerList(userId, pageParam?.cursor, pageParam?.cursorId),
    getNextPageParam: lastPage => {
      if (lastPage?.hasNextPage) {
        return {
          cursor: lastPage.nextCursor,
          cursorId: lastPage.nextCursorId,
        }
      }
      return undefined
    },
    enabled: userId !== undefined,
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
  })
}

export const useInfiniteMemberKeepLegalDictionaryList = (userId: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.MEMBER_KEEP_LEGAL_DICTIONARY_LIST, 'infinite', userId],
    queryFn: ({ pageParam }) =>
      memberService.memberKeepLegalDictionaryList(userId, pageParam?.cursor, pageParam?.cursorId),
    getNextPageParam: lastPage => {
      if (lastPage?.hasNextPage) {
        return {
          cursor: lastPage.nextCursor,
          cursorId: lastPage.nextCursorId,
        }
      }
      return undefined
    },
    enabled: userId !== undefined,
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
  })
}

export const useMemberKeepCount = (userId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.MEMBER_KEEP_COUNT, userId],
    queryFn: () => memberService.memberKeepCount(userId),
    enabled: userId !== undefined,
    // select: response,
  })
}
