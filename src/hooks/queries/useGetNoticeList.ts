import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/query'
import { noticeService } from '@/services/noticeService'
// import { NoticeListResponse } from '@/types/noticeTypes'

export const useGetNoticeList = (noticePage: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.NOTICE_LIST, noticePage],
    queryFn: () => noticeService.getNoticeList(noticePage),
    select: (data: any) => {
      console.log('원본 데이터:', data)
      // 현재: { notices: NoticeListResponse[] }
      if (data && 'notices' in data) {
        const result = data.notices
        console.log('변환된 데이터 (notices):', result)
        return result
      }
      // 미래: NoticeListResponse[]
      if (Array.isArray(data)) {
        console.log('변환된 데이터 (array):', data)
        return data
      }
      // 기본값
      console.log('기본값 반환: []')
      return []
    },
  })
}
