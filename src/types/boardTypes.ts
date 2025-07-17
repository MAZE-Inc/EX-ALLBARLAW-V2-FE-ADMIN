export interface NoticeType {
  noticeId: number
  category: '공지사항' | '이벤트' | '업데이트'
  title: string
  createdAt: string
}

export type NoticeDetailType = NoticeType & {
  content: string
}

type Notice = {
  noticeTypeId: number
  title: string
  content: string
  createdAt?: string
}

export type ServerNoticeType = {
  noticeId: number
  noticeTypeId: number
  noticeTitle: string
  noticeCreatedAt: string
}

export type NoticeListResponse = ServerNoticeType[]
export type NoticeDetailResponse = ServerNoticeType & { noticeContent: string }

export type NoticePostRequest = Notice

export type FaqType = {
  faqTypeId: number
  faqTypeName: string
}

export type Faq = {
  faqId: number
  faqTitle: string
  faqContent: string
  faqCreatedAt: string
} & Pick<FaqType, 'faqTypeId' | 'faqTypeName'>

export type FaqCreateRequest = {
  faqTitle: string
  faqContent: string
  faqTypeId: number
}
