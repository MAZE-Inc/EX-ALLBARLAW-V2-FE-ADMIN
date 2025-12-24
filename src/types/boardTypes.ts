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

export type NoticeListResponse = { notices: ServerNoticeType[] }
export type NoticeDetailResponse = ServerNoticeType & { noticeContent: string }

export type NoticePostRequest = Notice

export type FaqType = {
  faqTypeId: number
  faqTypeName: string
}

export type Faq = {
  faqId: number
  faqTitle: string
  faqCreatedAt: string
} & Pick<FaqType, 'faqTypeId'>

export type FaqEditRequest = {
  faqTitle: string
  faqContent: string
  faqTypeId: number
}

export type FaqDetailResponse = Faq & { faqContent: string }

export type FaqRequest = {
  faqPage?: number
  searchQuery?: string
  faqSearchType?: 'faqType' | 'title'
}
