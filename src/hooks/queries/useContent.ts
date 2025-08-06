import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { contentService } from '@/services/contentService'
import { QUERY_KEY } from '@/constants/query'
import { BlogListRequest } from '@/types/blogTypes'

export const useBlogList = (request: BlogListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.BLOG_LIST, request],
    queryFn: () => contentService.getBlogList(request),
  })
}

export const useInfiniteBlogList = (request: Omit<BlogListRequest, 'cursor' | 'cursorId'>) => {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY.BLOG_LIST, 'infinite', request.subcategoryId, request.orderBy],
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
    hasNextPage: query.data?.pages[query.data.pages.length - 1]?.hasNextPage ?? false
  }
}
