import instance from '@/lib/axios'
import {
  BlogDetailRequest,
  BlogDetailResponse,
  BlogListRequest,
  BlogListResponse,
  CreateBlogRequest,
  CreateBlogResponse,
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
  VideoDetailRequest,
  VideoDetailResponse,
  VideoListRequest,
  VideoListResponse,
} from '@/types/videoTypes'
import axios from 'axios'

export const contentService = {
  getBlogList: async (request: BlogListRequest) => {
    const { subcategoryId, take, cursor, cursorId, orderBy } = request

    // 쿼리 파라미터 객체 생성 (값이 있을 때만 포함)
    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/blog-case/${subcategoryId}${queryString ? `?${queryString}` : ''}`

    const response = await axios.get<BlogListResponse>('https://v2.allbarlawbiz.com' + url)

    return response.data
  },

  getBlogDetail: async (request: BlogDetailRequest) => {
    try {
      const response = await axios.get<BlogDetailResponse>(
        `https://v2.allbarlawbiz.com/blog-case/detail/${request.blogCaseId}`
      )

      return response.data
    } catch (error) {
      console.error('Failed to fetch blog detail:', error)
      throw error
    }
  },

  getVideoList: async (request: VideoListRequest) => {
    const { subcategoryId, take, cursor, cursorId, orderBy } = request

    // 쿼리 파라미터 객체 생성 (값이 있을 때만 포함)
    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/video-case/${subcategoryId}${queryString ? `?${queryString}` : ''}`

    const response = await axios.get<VideoListResponse>('https://v2.allbarlawbiz.com' + url)

    return response.data
  },

  getVideoDetail: async (request: VideoDetailRequest) => {
    const { videoCaseId } = request
    const response = await axios.get<VideoDetailResponse>(
      `https://v2.allbarlawbiz.com/video-case/detail/${videoCaseId}`
    )
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

    const response = await axios.get<KnowledgeListResponse>('https://v2.allbarlawbiz.com' + url)

    return response.data
  },

  getKnowledgeDetail: async (request: KnowledgeDetailRequest) => {
    const response = await axios.get<KnowledgeDetailResponse>(
      `https://v2.allbarlawbiz.com/knowledge/detail/${request.knowledgeId}`
    )

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
      videoCaseTags,
      videoCaseLawyerId,
    }

    const response = await instance.post<CreateVideoResponse>(`/video-cases/subcategory/${subcategoryId}`, payload)
    return response.data
  },
}
