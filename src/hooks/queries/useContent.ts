import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { contentService } from '@/services/contentService'
import { QUERY_KEY } from '@/constants/query'
import { BlogDetailRequest, BlogListRequest, CreateBlogRequest } from '@/types/blogTypes'
import {
  CreateVideoRequest,
  VideoChannelInfoResponse,
  VideoDetailRequest,
  VideoListRequest,
  YoutubeVideoInfoRequest,
  YoutubeVideoInfoResponse,
} from '@/types/videoTypes'
import { KnowledgeListRequest, KnowledgeDetailRequest } from '@/types/knowledgeType'

export const useBlogList = (request: BlogListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.BLOG_LIST, request],
    queryFn: () => contentService.getBlogList(request),
  })
}

export const useCountBlog = (subcategoryId: number | 'all', recentDays: number | 'all') => {
  return useQuery({
    queryKey: [QUERY_KEY.BLOG_COUNT, subcategoryId, recentDays],
    queryFn: () => contentService.getCountBlog(subcategoryId, recentDays),
  })
}

export const useInfiniteBlogList = (request: Omit<BlogListRequest, 'cursor' | 'cursorId'>) => {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY.BLOG_LIST, 'infinite', request.subcategoryId, request.orderBy, request.search],
    queryFn: ({ pageParam }) =>
      contentService.getBlogList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    enabled: request.subcategoryId !== undefined,
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
  })

  return {
    ...query,
    hasNextPage: query.data?.pages[query.data.pages.length - 1]?.hasNextPage ?? false,
  }
}

export const useGetBlogDetail = (request: BlogDetailRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.BLOG_DETAIL, request.blogCaseId],
    queryFn: () => contentService.getBlogDetail(request),
    enabled: request.blogCaseId !== undefined,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}

export const useVideoList = (request: VideoListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.VIDEO_LIST, request],
    queryFn: () => contentService.getVideoList(request),
  })
}

export const useInfiniteVideoList = (request: Omit<VideoListRequest, 'cursor' | 'cursorId'>) => {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY.VIDEO_LIST, 'infinite', request.subcategoryId, request.orderBy, request.search],
    queryFn: ({ pageParam }) =>
      contentService.getVideoList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    enabled: request.subcategoryId !== undefined,
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
  })

  return {
    ...query,
    hasNextPage: query.data?.pages[query.data.pages.length - 1]?.hasNextPage ?? false,
  }
}

export const useGetVideoDetail = (request: VideoDetailRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.VIDEO_DETAIL, request.videoCaseId],
    queryFn: () => contentService.getVideoDetail(request),
    enabled: request.videoCaseId !== undefined,
  })
}

export const useGetKnowledgeList = (request: KnowledgeListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.KNOWLEDGE_LIST, request.subcategoryId, request.cursorId, request.orderBy],
    queryFn: () => contentService.getKnowledgeList(request),
    enabled: request.subcategoryId !== undefined,
  })
}

export const useInfiniteKnowledgeList = (request: Omit<KnowledgeListRequest, 'cursor' | 'cursorId'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.KNOWLEDGE_LIST, 'infinite', request.subcategoryId, request.orderBy],
    queryFn: ({ pageParam }) =>
      contentService.getKnowledgeList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    enabled: request.subcategoryId !== undefined,
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
  })

  const knowledgeList = data?.pages.flatMap(page => page.data) ?? []

  return {
    knowledgeList,
    isLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  }
}

export const useGetKnowledgeDetail = (request: KnowledgeDetailRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.KNOWLEDGE_DETAIL, request.knowledgeId],
    queryFn: () => contentService.getKnowledgeDetail(request),
    enabled: request.knowledgeId !== undefined,
  })
}

export const useCreateBlog = ({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateBlogRequest) => contentService.createBlog(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BLOG_LIST] })
      onSuccess()
    },
    onError,
  })
}

export const useCreateVideo = ({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateVideoRequest) => contentService.createVideo(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.VIDEO_LIST] })
      onSuccess()
    },
    onError,
  })
}

export const useGetVideoChannelInfo = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: VideoChannelInfoResponse) => void
  onError: () => void
}) => {
  return useMutation({
    mutationFn: (request: { channelUrl: string }) => contentService.getVideoChannelInfo(request),
    onSuccess: (data: VideoChannelInfoResponse) => {
      onSuccess(data)
    },
    onError,
  })
}

export const useGetYoutubeVideoInfo = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: YoutubeVideoInfoResponse) => void
  onError: () => void
}) => {
  return useMutation({
    mutationFn: (request: YoutubeVideoInfoRequest) => contentService.getYoutubeVideoInfo(request),
    onSuccess,
    onError,
  })
}
