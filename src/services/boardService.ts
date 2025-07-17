import instance from '@/lib/axios'
import {
  FaqDetailResponse,
  FaqEditRequest,
  NoticeDetailResponse,
  NoticeListResponse,
  NoticePostRequest,
} from '@/types/boardTypes'

export const noticeService = {
  readNoticeCount: async () => await instance.get('/notice/count'),
  readNoticeType: async () => await instance.get('/notice/types'),
  readNoticeList: async (noticePage: number) =>
    await instance.get<NoticeListResponse>('/notice', {
      params: {
        noticePage: noticePage,
      },
    }),
  readNoticeDetail: async (noticeId: number) => await instance.get<NoticeDetailResponse>(`/notice/${noticeId}`),
  deleteNotice: async (noticeId: number) => await instance.delete(`/notice/${noticeId}`),
  updateNotice: async (noticeId: number, notice: NoticePostRequest) =>
    await instance.put(`/notice/${noticeId}`, notice),
  postNotice: async (notice: NoticePostRequest) => await instance.post('/notice', notice),
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
