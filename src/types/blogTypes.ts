import { SortType } from './sortType'

export type BlogCountRequest = {
  subcategoryId: number | 'all'
  recentDays: number
}

export type BlogListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: SortType
  search?: string
}

export type RandomBlogListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  excludeIds?: number[]
}

export type BlogDetailRequest = {
  blogCaseId: number
  subcategoryId?: number | 'all'
}
export interface BlogCase {
  subcategoryId: number
  blogCaseId: number
  title: string
  summaryContent: string
  thumbnail: string
  lawyerName: string
  lawfirmName: string
  lawyerId: number
  lawyerProfileImage: string
  isKeep: boolean
}

export type BlogListResponse = {
  data: BlogCase[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}

export type RandomBlogListResponse = {
  data: BlogCase[]
  hasNextPage: boolean
}

export type BlogDetailResponse = Omit<BlogCase, 'isKeep'> & {
  source: string
  tags: { id: number; name: string }[]
}

export type CreateBlogRequest = {
  blogCaseId: number
  blogCaseTitle: string
  blogCaseSummaryContent: string
  blogCaseSource: string
  blogCaseTags: string[]
  blogCaseLawyerId: number
  subcategoryId: number
  blogCaseThumbnail: string
}

export type CreateBlogResponse = {
  blogCaseId: number
  blogCaseTitle: string
  blogCaseOriginalContentLength: number
  blogCaseSummaryContent: string
  blogCaseThumbnail: string | null
  blogCaseSource: string
  blogCaseLikesCount: number
  blogCaseViewCount: number
  blogCasePublishedAt: string
  blogCaseSubcategoryId: number
  blogCaseLawyerId: number
  blogCaseCreatedAt: string
  blogCaseUpdatedAt: string
  blogCaseTags: string[]
}
