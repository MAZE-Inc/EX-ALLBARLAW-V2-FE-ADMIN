import { SortType } from './sortType'

export type VideoCountRequest = {
  subcategoryId?: number | 'all'
  recentDays: number | 'all'
}

export type VideoListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: SortType
}

export type RandomVideoListRequest = {
  subcategoryId: number | 'all'
  take?: number
  excludeIds?: number[]
}

export type VideoDetailRequest = {
  videoCaseId: number
  subcategoryId?: number | 'all'
}

export interface VideoCase {
  videoCaseId: number
  title: string
  thumbnail: string
  channelName: string
  channelThumbnail: string
  lawyerId: number
  lawyerName: string
  lawfirmName: string
  subcategoryId: number
  summaryContent: string
  isKeep: boolean
}

export type VideoListResponse = {
  data: VideoCase[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}

export type VideoDetailResponse = Omit<VideoCase, 'isKeep'> & {
  source: string
  handleName: string
  channelDescription: string
  subscriberCount: number
  lawyerProfileImage: string
  tags: string[]
}
