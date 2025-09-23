import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { lawfirmService } from '@/services/lawfirmService'
import { LawfirmApiRequest, LawfirmListRequest } from '@/types/lawfirmTypes'
import { QUERY_KEY } from '@/constants/query'
import { AxiosError } from 'axios'

interface UseLawfirmInfiniteScrollProps {
  searchQuery?: string
  lawfirmSearchType?: 'name' | 'greeting'
  lawfirmOrderBy?: 'name' | 'createdAt' | 'viewCount'
  lawfirmSort?: 'asc' | 'desc'
}

export const useLawfirmInfiniteScroll = ({
  searchQuery,
  lawfirmSearchType,
  lawfirmOrderBy = 'createdAt',
  lawfirmSort = 'desc',
}: UseLawfirmInfiniteScrollProps = {}) => {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY.LAWFIRM_LIST, { searchQuery, lawfirmSearchType, lawfirmOrderBy, lawfirmSort }],
    queryFn: ({ pageParam = 1 }) => {
      const request: LawfirmListRequest = {
        lawfirmPage: pageParam,
        searchQuery,
        lawfirmSearchType,
        lawfirmOrderBy,
        lawfirmSort,
      }
      return lawfirmService.getLawfirmList(request)
    },
    getNextPageParam: lastPage => {
      // 현재 페이지가 마지막 페이지보다 작으면 다음 페이지 반환
      return lastPage.lawfirmPage < lastPage.lawfirmTotalPages ? lastPage.lawfirmPage + 1 : undefined
    },
    initialPageParam: 1,
  })

  // 모든 페이지의 데이터를 플랫하게 합치기
  const lawfirmData = query.data?.pages.flatMap(page => page.lawfirmData) || []

  // 첫 번째 페이지에서 전체 개수 가져오기
  const lawfirmTotal = query.data?.pages[0]?.lawfirmTotal || 0

  return {
    ...query,
    lawfirmData,
    lawfirmTotal,
  }
}

export const useLawfirm = (lawfirmId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWFIRM_DETAIL, lawfirmId],
    queryFn: () => lawfirmService.getLawfirm(lawfirmId),
    enabled: !!lawfirmId,
  })
}

export const useCreateLawfirm = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: (error: AxiosError) => void
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: lawfirmService.createLawfirm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LAWFIRM_LIST] })
      onSuccess?.()
    },
    onError: (error: AxiosError) => {
      onError?.(error)
    },
  })
}

export const useUpdateLawfirm = ({ onSuccess, onError }: { onSuccess?: () => void; onError?: () => void } = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ lawfirmId, request }: { lawfirmId: number; request: LawfirmApiRequest }) =>
      lawfirmService.updateLawfirm(lawfirmId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LAWFIRM_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LAWFIRM_DETAIL, variables.lawfirmId] })
      onSuccess?.()
    },
    onError: () => {
      onError?.()
    },
  })
}
