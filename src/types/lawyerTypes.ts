import { BlogCase } from './blogTypes'
import { KnowledgeItem } from './knowledgeType'
import { SortType } from './sortType'

import { VideoCase } from './videoTypes'

export type SocialLink = {
  type: 'naver' | 'youtube' | 'instagram'
  link: string
}

export type Tag = {
  id: number
  name: string
}

export type Lawyer = {
  lawyerId: number
  lawfirmName: string
  lawyerName: string
  lawyerProfileImage: string
  tags?: Tag[]
  lawyerDescription?: string
  lawyerBlogUrl?: string
  lawyerYoutubeUrl?: string
  lawyerInstagramUrl?: string
  lawyerBlogCaseCount: number
  lawyerVideoCaseCount: number
  lawyerChatRoomCount: number
  lawyerTotalSiteVisitCount: number
  lawyerLast30DaysSiteVisitCount: number
}

export type AIRecommenderLawyerItem = Pick<
  Lawyer,
  'lawyerId' | 'lawfirmName' | 'lawyerName' | 'lawyerProfileImage' | 'tags' | 'lawyerDescription'
>

export type LawyerListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: SortType
  gender?: number | 'all'
  achievementId?: 'all'
  sort?: 'asc' | 'desc'
}

export type LawyerListResponse = {
  data: Lawyer[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}

export type LawyerAchievement = {
  id: number
  name: string
  description: string
}

type LawyerStatistics = {
  blogPostCount: number
  videoCount: number
  knowledgeAnswerCount: number
  last30DaysSiteVisitCount: number
  totalSiteVisitCount: number
}

type LawyerCareer = {
  id: number
  categoryName: string
  content: string
  displayOrder: number
}

type LawyerActivity = {
  id: number
  categoryName: string
  content: string
  displayOrder: number
}

export type LawyerDetailResponse = {
  lawyerId: number
  lawyerName: string
  lawyerDescription: string
  lawfirmName: string
  lawyerProfileImage: string
  isKeep: boolean
  lawyerProfileImages: {
    createdAt: string
    displayOrder: number
    imageId: number
    imageUrl: string
    isDefault: true
  }[]
  tags: Tag[]
  createdAt: string
  lawfirmAddress: string
  lawfirmContact: string
  subcategories: { id: number; name: string }[]
  statistics: LawyerStatistics
  achievements: LawyerAchievement[]
  careers: LawyerCareer[]
  activities: LawyerActivity[]
  blogCases: BlogCase[]
  videoCases: VideoCase[]
  consultationRequests: KnowledgeItem[]
}

export type RandomLawyerListRequest = {
  subcategoryId: number | 'all'
  take?: number
  excludeIds?: number[]
}

export type RandomLawyerListResponse = {
  data: Lawyer[]
  hasNextPage: boolean
}

export type LawyerKeepResponse = {
  isKeep: boolean
}

export type LawyerActiveRequest = {
  page?: number
  take?: number
  days?: number
}

export type LawyerActiveResponse = {
  data: {
    lawyerId: number
    lawyerName: string
    lawyerProfileImage: string
    lawyerLawfirmName: string
    lawyerDescription: string
    recentMessageCount: number
    activeChatRoomCount: number
    tags: Tag[]
  }[]

  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
}

export type LawyerSignUpRequest = {
  lawyerAccount: string
  lawyerPassword: string
  lawyerPasswordRepeat: string
  lawyerName: string
  lawyerContact: string
  lawyerLawfirmName: string
  lawyerBarExamNumber: string
  lawyerEmail: string
}

export type LawyerSignUpResponse = {
  lawyerId: number
  lawyerAccount: string
  message: string
}

export interface LawyerMemberListRequest {
  lawyerPage?: number
  orderBy?:
    | 'name'
    | 'createdAt'
    | 'blogCaseCount'
    | 'videoCaseCount'
    | 'chatRoomCount'
    | 'totalVisitCount'
    | 'monthlyVisitCount'
  sort?: 'asc' | 'desc'
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'all'

export interface LawyerInfoListRequest extends LawyerMemberListRequest {
  state?: 'all' | 'new' | 'pending' | 'approved'
}

export type LawyerMemberListResponse = {
  lawyerList: Lawyer[]
  totalCount: number
  page: number
  totalPages: number
}

export type LawyerInfoListResponse = {
  lawyerList: [
    {
      lawyerId: number
      lawyerEmail: string
      lawyerName: string
      lawyerContact: string | null
      lawyerLawfirmName: string | null
      lawyerLawfirmContact: string
      lawyerBarExamNumber: number
      lawyerApprovalStatus: string
      lawyerLawSchoolDiplomaUrl: string | null
      lawyerCertificateUrl: string | null
      lawyerBarExamPassDate: string | null
      lawyerCreatedAt: string
    }
  ]
  totalCount: 0
  page: 0
  totalPages: 0
}

export type LawyerRegisterModifyRequest = {
  lawyerLawSchoolDiplomaUrl?: string
  lawyerCertificateUrl?: string
  lawyerApprovalStatus?: 1 | 2
  barExamPassYear?: number
  barExamPassMonth?: number
  barExamPassDay?: number
}

export type LawyerRegisterModifyResponse = {
  lawyerId: number
  lawyerEmail: string
  lawyerName: string
  lawyerContact: string | null
  lawyerLawfirmName: string | null
  lawyerLawfirmContact: string
  lawyerBarExamNumber: number
  lawyerApprovalStatus: string
  lawyerLawSchoolDiplomaUrl: string | null
  lawyerCertificateUrl: string | null
  lawyerBarExamPassDate: string | null
  lawyerCreatedAt: string
}

export type LawyerSearchRequest = {
  searchQuery: string
  searchType?: 'lawyerName' | 'lawfirmName'
}

export type LawyerSearchResponse = {
  lawyerSearchResults: {
    lawyerId: number
    lawyerName: string
    lawyerProfileImage: string | null
    lawyerLawfirmName: string | null
    lawyerCreatedAt: string
  }[]
}
