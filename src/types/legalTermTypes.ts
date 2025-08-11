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

export type LegalTermListRequest = {
  page?: number
  searchQuery?: string
  searchType?: 'korean' | 'english' | 'chinese' | 'all'
}

export type LegalTermListResponse = {
  legalTerms: {
    id: number
    koreanName: string
    englishName: string
    chineseName: string
  }[]

  total: number
  page: number
  totalPages: number
}

export interface LegalTermReportRequest extends LegalTermListRequest {
  status: 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'REJECTED'
}

export interface LegalTermReportResponse {
  reports: {
    id: number
    legalTermId: number
    koreanName: string
    englishName: string
    chineseName: string
    status: 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'REJECTED'
    createdAt: string
    reportType: 'CONTENT_ERROR' | 'CONTENT_INACCURACY' | 'CONTENT_INCOMPLETE' | 'CONTENT_OTHER'
    description: string
  }[]
  total: number
  page: number
  totalPages: number
}
