import { noticeService } from '@/services/noticeService'
import { NoticePostRequest } from '@/types/noticeTypes'
import { useMutation } from '@tanstack/react-query'

// 공지사항을 작성하는 뮤테이션 훅
export const usePostNotice = () => {
  return useMutation({
    // mutationKey: [QUERY_KEY.TRACK_VIEW],
    mutationFn: (notice: NoticePostRequest) => noticeService.postNotice(notice),
    onSuccess: (_, variables) => {
      console.log(`공지사항 작성 성공: ID ${variables}`)
    },
    onError: (error, variables) => {
      console.error(`공지사항 작성 실패: ID ${variables}`, error)
    },
  })
}
