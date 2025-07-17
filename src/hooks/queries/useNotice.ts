import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { noticeService } from '@/services/boardService'
import { QUERY_KEY } from '@/constants/query'
import { NoticePostRequest } from '@/types/boardTypes'

export const useReadNoticeType = () => {
  const {
    data: noticeTypeResponse,
    isError,
    error,
    ...rest
  } = useQuery({
    queryKey: [QUERY_KEY.NOTICE_TYPE],
    queryFn: async () => {
      const res = await noticeService.readNoticeType()
      return res.data
    },
  })

  const getTypeName = (noticeTypeId: number) =>
    noticeTypeResponse?.find((type: any) => type.noticeTypeId === noticeTypeId)?.noticeTypeName

  return {
    noticeTypeResponse,
    isError,
    error,
    getTypeName,
    ...rest,
  }
}
export const useGetNoticeList = (noticePage: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.NOTICE_LIST, noticePage],
    queryFn: async () => {
      const res = await noticeService.readNoticeList(noticePage)
      return res.data.notices
    },
  })
}

export const useGetNoticeDetail = (noticeId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.NOTICE_DETAIL, noticeId],
    queryFn: async () => {
      const res = await noticeService.readNoticeDetail(noticeId)
      return res.data
    },
  })
}

export const useDeleteNotice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (noticeId: number) => noticeService.deleteNotice(noticeId),
    onSuccess: (_data, _variables) => {
      message.success('공지사항이 삭제되었습니다.')
      // NOTICE로 시작하는 모든 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTICE_DETAIL],
      })
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

export const useUpdateNotice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ noticeId, notice }: { noticeId: number; notice: NoticePostRequest }) =>
      noticeService.updateNotice(noticeId, notice),
    onSuccess: () => {
      message.success('공지사항이 수정되었습니다.')
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTICE_LIST],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTICE_DETAIL],
      })
    },
    onError: (error, variables) => {
      console.error(`공지사항 작성 실패: ID ${variables.noticeId}`, error)
      message.error('공지사항 수정에 실패했습니다.')
    },
  })
}
