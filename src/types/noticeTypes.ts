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

export type NoticeListResponse = {
  noticeId: number
  noticeTypeId: number
  noticeTitle: string
  noticeCreatedAt: string
}[]

export type NoticePostRequest = Notice
