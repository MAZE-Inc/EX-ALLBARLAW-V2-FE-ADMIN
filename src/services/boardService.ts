import instance from '@/lib/axios'
import {
  FaqDetailResponse,
  FaqEditRequest,
  NoticeDetailResponse,
  NoticeListResponse,
  NoticePostRequest,
} from '@/types/boardTypes'

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

  getNoticeDetail: async (noticeId: number) => {
    try {
      const response = await instance.get<NoticeDetailResponse>(`/notice/${noticeId}`)
      return response.data
    } catch (error) {
      console.error('Failed to get notice detail:', error)
      throw error
    }
  },

  deleteNotice: async (noticeId: number) => {
    const response = await instance.delete(`/notice/${noticeId}`)
    return response.data
  },

  updateNotice: async (noticeId: number, notice: NoticePostRequest) => {
    const response = await instance.put(`/notice/${noticeId}`, notice)
    return response.data
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

export const faqService = {
  readFaqCount: async () => await instance.get('/faq/count'),
  readFaqType: async () => await instance.get('/faq/types'),
  createFaqType: async (faqTypeName: string) => await instance.post('/faq/types', { faqTypeName }),
  readFaq: async (faqPage: number) => await instance.get('/faq', { params: { faqPage } }),
  createFaq: async (faq: FaqEditRequest) => await instance.post('/faq', faq),
  readFaqDetail: async (faqId: number) => await instance.get<FaqDetailResponse>(`/faq/${faqId}`),
  deleteFaq: async (faqId: number) => await instance.delete(`/faq/${faqId}`),
  updateFaq: async (faqId: number, faq: FaqEditRequest) => await instance.patch(`/faq/${faqId}`, faq),
}
