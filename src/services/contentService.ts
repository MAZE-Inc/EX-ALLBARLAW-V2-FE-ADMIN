import { BlogDetailRequest, BlogDetailResponse, BlogListRequest, BlogListResponse } from '@/types/blogTypes'
import { VideoDetailRequest, VideoDetailResponse, VideoListRequest, VideoListResponse } from '@/types/videoTypes'
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

  getVideoDetail: async (request: VideoDetailRequest) => {
    const { videoCaseId } = request
    const response = await axios.get<VideoDetailResponse>(
      `https://v2.allbarlawbiz.com/video-case/detail/${videoCaseId}`
    )
    return response.data
  },
}
