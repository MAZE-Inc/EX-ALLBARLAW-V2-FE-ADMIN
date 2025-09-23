import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { BlogAiSummaryRequest, KnowledgeAiTitleResponse } from '@/types/aiSummaryTypes'
import { QUERY_KEY } from '@/constants/query'
import { aiSummaryService } from '@/services/aiSummaryService'

export const useBlogAiSummary = (
  request: BlogAiSummaryRequest,
  options?: Omit<UseQueryOptions<any, Error, any>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [QUERY_KEY.BLOG_AI_SUMMARY, request.url, request.category],
    queryFn: async () => {
      // 블로그 AI 요약도 시간이 오래 걸릴 수 있으므로 타임아웃 제거
      const response = await aiSummaryService.getBlogAiSummary(request)
      return response
    },
    retry: 1, // 한 번만 재시도
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    ...options,
  })
}

export const useVideoAiSummary = (
  request: { url: string },
  options?: Omit<UseQueryOptions<any, Error, any>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [QUERY_KEY.VIDEO_AI_SUMMARY, request.url],
    queryFn: async () => {
      // 비디오 AI 요약은 시간이 오래 걸릴 수 있으므로 타임아웃 제거
      const response = await aiSummaryService.getVideoAiSummary(request)
      return response
    },
    retry: 1, // 한 번만 재시도
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    ...options,
  })
}

export const useKnowledgeAiTitle = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: KnowledgeAiTitleResponse) => void
  onError: (_error: any) => void
}) => {
  return useMutation({
    mutationFn: (request: { text: string }) => aiSummaryService.generateKnowledgeAiTitle(request),
    onSuccess: data => {
      onSuccess(data)
    },
    onError: error => {
      onError(error)
    },
  })
}
