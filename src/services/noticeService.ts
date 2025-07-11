import instance from '@/lib/axios'
import { NoticeListResponse, NoticePostRequest } from '@/types/noticeTypes'

export const noticeService = {
  getNoticeList: async (noticePage: number) => {
    try {
      const response = await instance.get<NoticeListResponse>('/notice', {
        params: {
          noticePage: noticePage,
        },
      })
      console.log('API Response:', response.data)
      return response.data
    } catch (error) {
      console.error('Failed to get notice list:', error)
      throw error
    }
  },
  postNotice: async (notice: NoticePostRequest) => {
    try {
      const response = await instance.post('/notice', notice)
      return response.data
    } catch (error) {
      console.error('Failed to post notice:', error)
      throw error
    }
  },
}
