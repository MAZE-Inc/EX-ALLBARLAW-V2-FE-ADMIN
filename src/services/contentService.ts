import instance from '@/lib/axios'
import {
  BlogDetailRequest,
  BlogDetailResponse,
  BlogListRequest,
  BlogListResponse,
  CreateBlogRequest,
  CreateBlogResponse,
  EditBlogRequest,
  EditBlogResponse,
} from '@/types/blogTypes'
import {
  KnowledgeDetailRequest,
  KnowledgeDetailResponse,
  KnowledgeListRequest,
  KnowledgeListResponse,
} from '@/types/knowledgeType'
import {
  CreateVideoRequest,
  CreateVideoResponse,
  EditVideoRequest,
  EditVideoResponse,
  VideoChannelInfoResponse,
  VideoDetailRequest,
  VideoDetailResponse,
  VideoListRequest,
  VideoListResponse,
  YoutubeVideoInfoRequest,
  YoutubeVideoInfoResponse,
} from '@/types/videoTypes'
import axios from 'axios'

const userUrl = import.meta.env.VITE_USER_SERVER_API

export const contentService = {
  getCountBlog: async (subcategoryId: number | 'all', recentDays: number | 'all') => {
    const response = await axios.get(`${userUrl}/blog-cases/${subcategoryId}/${recentDays}/count`)
    return response.data
  },
  getBlogList: async (request: BlogListRequest) => {
    const { subcategoryId, take, cursor, cursorId, orderBy, search, searchType } = request

    // 쿼리 파라미터 객체 생성 (값이 있을 때만 포함)
    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)
    if (search !== undefined) params.append('search', search)
    if (searchType !== undefined) params.append('searchType', searchType)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/blog-cases/list/${subcategoryId}${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<BlogListResponse>(url)

    return response.data
  },

  getBlogDetail: async (request: BlogDetailRequest) => {
    try {
      const response = await instance.get<BlogDetailResponse>(`/blog-cases/detail/${request.blogCaseId}`)

      return response.data
    } catch (error) {
      console.error('Failed to fetch blog detail:', error)
      throw error
    }
  },

  editBlog: async (request: EditBlogRequest, blogCaseId: number) => {
    const response = await instance.patch<EditBlogResponse>(`/blog-cases/${blogCaseId}`, request)
    return response.data
  },

  deleteBlog: async (blogCaseId: number) => {
    const response = await instance.delete(`/blog-cases/${blogCaseId}`)
    return response.data
  },

  getCountVideo: async (subcategoryId: number | 'all', recentDays: number | 'all') => {
    const response = await instance.get(`/video-case/${subcategoryId}/${recentDays}/count`)
    return response.data
  },

  getVideoList: async (request: VideoListRequest) => {
    const { subcategoryId, take, cursor, cursorId, orderBy, search } = request

    // 쿼리 파라미터 객체 생성 (값이 있을 때만 포함)
    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)
    if (search !== undefined) params.append('search', search)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/video-cases/list/${subcategoryId}${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<VideoListResponse>(url)

    return response.data
  },

  getVideoDetail: async (request: VideoDetailRequest) => {
    const { videoCaseId } = request
    const response = await axios.get<VideoDetailResponse>(`${userUrl}/video-case/detail/${videoCaseId}`)
    return response.data
  },

  getKnowledgeList: async (request: KnowledgeListRequest) => {
    const { subcategoryId, take, cursor, cursorId, orderBy } = request

    // 쿼리 파라미터 객체 생성 (값이 있을 때만 포함)
    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/knowledge/${subcategoryId}${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<KnowledgeListResponse>(url)

    return response.data
  },

  getKnowledgeDetail: async (request: KnowledgeDetailRequest) => {
    const response = await instance.get<KnowledgeDetailResponse>(`/knowledge/detail/${request.knowledgeId}`)

    return response.data
  },

  createBlog: async (request: CreateBlogRequest) => {
    const {
      subcategoryId,
      blogCaseId,
      blogCaseTitle,
      blogCaseSummaryContent,
      blogCaseSource,
      blogCaseTags,
      blogCaseLawyerId,
      blogCaseThumbnail,
    } = request

    const payload = {
      blogCaseId,
      blogCaseTitle,
      blogCaseSummaryContent,
      blogCaseSource,
      blogCaseTags,
      blogCaseLawyerId,
      blogCaseThumbnail: blogCaseThumbnail || '',
    }

    const response = await instance.post<CreateBlogResponse>(`/blog-cases/subcategory/${subcategoryId}`, payload)
    return response.data
  },

  createVideo: async (request: CreateVideoRequest) => {
    const {
      subcategoryId,
      videoCaseTitle,
      videoCaseSummaryContent,
      videoCaseSource,
      videoCaseTags,
      videoCaseLawyerId,
      videoCaseThumbnail,
      videoCaseChannelDescription,
      videoCaseChannelThumbnail,
      videoCaseHandleName,
      videoCaseChannelName,
      videoCaseSubscriberCount,
    } = request

    const payload = {
      videoCaseTitle,
      videoCaseSummaryContent,
      videoCaseSource,
      videoCaseThumbnail,
      videoCaseChannelDescription,
      videoCaseChannelThumbnail,
      videoCaseHandleName,
      videoCaseChannelName,
      videoCaseSubscriberCount,
      videoCaseTags,
      videoCaseLawyerId,
    }

    const response = await instance.post<CreateVideoResponse>(`/video-cases/subcategory/${subcategoryId}`, payload)
    return response.data
  },

  editVideo: async (request: EditVideoRequest, videoCaseId: number) => {
    const response = await instance.patch<EditVideoResponse>(`/video-cases/${videoCaseId}`, request)
    return response.data
  },

  deleteVideo: async (videoCaseId: number) => {
    const response = await instance.delete(`/video-cases/${videoCaseId}`)
    return response.data
  },

  getVideoChannelInfo: async (request: { channelUrl: string }) => {
    const response = await instance.post<VideoChannelInfoResponse>(`/video-cases/youtube/channel/fetch`, request)
    return response.data
  },
  getYoutubeVideoInfo: async (request: YoutubeVideoInfoRequest) => {
    const response = await instance.post<YoutubeVideoInfoResponse>(`/video-cases/youtube/video/fetch`, request)
    return response.data
  },
}
