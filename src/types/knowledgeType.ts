import { SortType } from './sortType'

export type KnowledgeListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: SortType
  search?: string
  searchType?: 'title' | 'lawyerName'
}

export type KnowledgeDetailRequest = {
  knowledgeId: number
  subcategoryId?: number | 'all'
}

export type KnowledgeItem = {
  knowledgeId: number
  knowledgeTitle: string
  summaryContent: string
  lastMessageAt: string
  lawyers: {
    lawyerId: number
    lawyerName: string
    lawyerProfileImage: string
  }[]
}

export type KnowledgeListResponse = {
  data: KnowledgeItem[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}

export type KnowledgeDetailResponse = {
  knowledgeId: number
  knowledgeTitle: string
  knowledgeDescription: string
  lastMessageAt: string
  tags: { id: number; name: string }[]
  lawyers: {
    lawyerId: number
    lawyerName: string
    lawfirmName: string
    lawyerDescription: string
    lawyerProfileImage: string
    content: string
  }[]
}
