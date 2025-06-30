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
  noticeList: Notice[]
  totalCount: number
}

export type NoticePostRequest = Notice
