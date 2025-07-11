import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { noticeService } from '@/services/noticeService'
import { QUERY_KEY } from '@/constants/query'

export const useDeleteNotice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (noticeId: number) => noticeService.deleteNotice(noticeId),
    onSuccess: (_data, _variables) => {
      message.success('공지사항이 삭제되었습니다.')
      // NOTICE로 시작하는 모든 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTICE_LIST],
      })
    },
    onError: (error: Error) => {
      console.error('삭제 실패:', error)
      message.error('공지사항 삭제에 실패했습니다.')
    },
  })
}
