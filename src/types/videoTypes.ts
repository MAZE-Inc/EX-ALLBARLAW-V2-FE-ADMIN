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
  tags: { id: number; name: string }[]
}

export type CreateVideoRequest = {
  subcategoryId: number
  videoCaseTitle: string
  videoCaseSummaryContent: string
  videoCaseSource: string
  videoCaseThumbnail: string
  videoCaseChannelDescription: string
  videoCaseChannelThumbnail: string
  videoCaseHandleName: string
  videoCaseChannelName: string
  videoCaseTags: string[]
  videoCaseLawyerId: number
}

export type CreateVideoResponse = {
  videoCaseId: number
  videoCaseTitle: string
  videoCaseSource: string
  videoCaseThumbnail: string
  videoCaseSummaryContent?: string | null
  videoCaseChannelName: string
  videoCaseSubscriberCount: number
  videoCaseHandleName: string
  videoCaseChannelThumbnail: string
  videoCaseChannelDescription?: string | null
  videoCaseLikesCount: number
  videoCaseViewCount: number
  videoCasePublishedAt: string
  videoCaseSubcategoryId?: number | null
  videoCaseLawyerId?: number | null
  videoCaseCreatedAt: string
  videoCaseUpdatedAt: string
  videoCaseTags: string[]
}
