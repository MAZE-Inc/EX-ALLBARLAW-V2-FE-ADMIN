import { BlogCase } from './blogTypes'
import { KnowledgeItem } from './knowledgeType'
import { SortType } from './sortType'

import { VideoCase } from './videoTypes'

export type LegalTermItem = {
  legalTermChineseName: string
  legalTermEnglishName: string
  legalTermKoreanName: string
  legalTermId: number
  searchCount?: number
  viewCount?: number
  searchedAt?: string
  createdAt?: string
  content?: string
  source?: string
}

export type PopularLegalTermListResponse = {
  data: LegalTermItem[]
}

export type RecentSearchesResponse = {
  data: LegalTermItem[]
}

export type RecentRegisteredLegalTermListResponse = {
  data: LegalTermItem[]
}

export type SearchLegalTermRequest = {
  legalTermPage: number
  orderBy: SortType
  sort: 'asc' | 'desc'
  search: string
}

export type LegalTermListRequest = {
  legalTermPage?: number
  orderBy?: SortType
  sort?: 'asc' | 'desc'
  search?: string
  consonant?: string
  take?: number
  cursor?: number
  cursorId?: number
}

export type LegalTermListResponse = {
  data: LegalTermItem[]
  hasNextPage: boolean
  total?: number
  legalTermPage?: number
  totalPages?: number
}

export type LegalTermDetailResponse = {
  legalTermId: number
  koreanName: string
  chineseName: string
  englishName: string
  content: string
  source: string
  viewCount: number
  createdAt: string
  updatedAt: string
  isKeep: boolean
  relatedContent: {
    blogCases: BlogCase[]
    videoCases: VideoCase[]
    knowledgeAnswers: KnowledgeItem[]
  }
  similarTerms: LegalTermItem[]
}

export type LegalTermReportRequest = {
  reportType: 'CONTENT_ERROR' | 'CONTENT_INACCURACY' | 'CONTENT_INCOMPLETE' | 'CONTENT_OTHER'
  description: string
}
