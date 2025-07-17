import { QUERY_KEY } from '@/constants/query'
import { noticeService } from '@/services/boardService'
import { NoticePostRequest } from '@/types/boardTypes'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// 공지사항을 작성하는 뮤테이션 훅
export const usePostNotice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationKey: [QUERY_KEY.TRACK_VIEW],
    mutationFn: (notice: NoticePostRequest) => noticeService.postNotice(notice),
    onSuccess: (_, variables) => {
      console.log(`공지사항 작성 성공: ID ${variables}`)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTICE_LIST],
      })
    },
    onError: (error, variables) => {
      console.error(`공지사항 작성 실패: ID ${variables}`, error)
    },
  })
}
