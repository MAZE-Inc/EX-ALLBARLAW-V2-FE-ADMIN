import { BlogCase } from './blogTypes'
import { KnowledgeItem } from './knowledgeType'

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
  // lawfirmName: string
  lawyerLawfirmName: string
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
  'lawyerId' | 'lawyerLawfirmName' | 'lawyerName' | 'lawyerProfileImage' | 'tags' | 'lawyerDescription'
>

export type LawyerListRequest = {
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
  search?: string
  searchType?: 'lawyerName' | 'lawfirmName' | 'all'
}

export type LawyerListResponse = {
  lawyerList: Lawyer[]
  totalCount: number
  page: number
  totalPages: number
}

export type LawyerAchievement = {
  id: number
  name: string
  description: string
}

type LawyerStatistics = {
  blogCaseCount: number
  videoCount: number
  consultationRequestCount: number
  last30DaysSiteVisitCount: number
  totalSiteVisitCount: number
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

export type laywerInfoOrderby =
  | 'account'
  | 'email'
  | 'name'
  | 'phone'
  | 'office'
  | 'exam'
  | 'approvalStatus'
  | 'createdAt'

export interface LawyerInfoListRequest extends Omit<LawyerMemberListRequest, 'orderBy'> {
  orderBy?: laywerInfoOrderby
  state?: 'all' | 'new' | 'pending' | 'approved'
  search?: string
  searchType?: 'account' | 'email' | 'name' | 'contact' | 'lawfirmName' | 'lawfirmContact' | 'all'
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
      lawyerAccount: string
      lawyerEmail: string
      lawyerName: string
      lawyerContact: string | null
      lawyerLawfirmName: string | null
      lawyerLawfirmContact: string
      lawyerBarExamNumber: number
      lawyerApprovalStatus: string
      lawyerWithdrawalStatus: null | 'PENDING'
      lawyerWithdrawalStatusId: number | null
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
  lawyerWithdrawalStatus?: null | 'PENDING'
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

export type LawyerSearchResult = {
  lawyerId: number
  lawyerName: string
  lawyerProfileImage: string | null
  lawyerLawfirmName: string | null
  lawyerDescription: string | null
  lawyerCreatedAt: string
}

export type LawyerSearchResponse = {
  lawyerSearchResults: {
    lawyerId: number
    lawyerName: string
    lawyerProfileImage: string | null
    lawyerLawfirmName: string | null
    lawyerDescription: string | null
    lawyerCreatedAt: string
  }[]
}

export interface LawyerBasicInfo {
  lawyerDescription: string
  lawyerName: string
  lawyerBirthYear: number
  lawyerBirthMonth: number
  lawyerBirthDay: number
  lawyerGender: number
  lawyerPhone: string
  lawyerInstagramUrl?: string | null
  lawyerYoutubeUrl?: string | null
  lawyerBlogUrl?: string | null
  lawyerTags: {
    tagId: number
    tagName: string
  }[]
  lawyerLawfirmName: string
  lawyerLawfirmAddress: string
  lawyerLawfirmAddressDetail: string
  lawyerLawfirmContact: string
  lawyerSubcategories: {
    subcategoryId: number
    subcategoryName: string
  }[]
  lawyerProfileImages?: {
    id: number
    imageUrl: string
    displayOrder: number
    isDefault: boolean
  }[]
}

export interface LawyerUpdateRequest extends Omit<LawyerBasicInfo, 'lawyerTags' | 'lawyerProfileImages'> {
  lawyerTags: string[]
  lawyerProfileImages: {
    imageUrl: string
    displayOrder: number
  }[]
}

export type LawyerCareer = {
  lawyerCareerCategoryName: string
  lawyerCareerContent: string
  lawyerCareerDisplayOrder: number
}

export type LawyerActivity = {
  lawyerActivityCategoryName: string
  lawyerActivityContent: string
  lawyerActivityDisplayOrder: number
}

export type AdLawyer = {
  lawyerAdId: number
  lawyerAdLawyerId: number
  lawyerAdLawyerName: string
  lawyerAdLawyerProfileImage: string | null
  lawyerAdLawyerDescription: string
  lawyerAdLawyerTags: Tag[]
  lawyerAdStartedAt: string
  lawyerAdFinishedAt: string
  lawyerAdCreatedAt: string
}

export type AdLawyerUpdateRequest = {
  lawyerAdLawyerId: number
  lawyerAdStartedAt: string | Date
  lawyerAdFinishedAt: string | Date
}

export type LawyerWithdrawalInfoResponse = {
  withdrawalId: number
  lawyerAccount: string
  withdrawalReason: string | null
  withdrawalStatus: string
  withdrawalRequestedAt: string
  withdrawalApprovedAt: string | null
  approvedByAdminId: number | null
  approvedByAdminName: string | null
  withdrawalRejectedAt: string | null
  withdrawalRejectedReason: string | null
}
