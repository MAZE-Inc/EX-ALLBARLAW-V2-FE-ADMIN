import instance from '@/lib/axios'
import { NoticePostRequest } from '@/types/noticeTypes'

export const noticeService = {
  //   getNoticeList: async (request: NoticeListRequest) => {
  //     const { take, cursor, cursorId } = request
  //     const params = new URLSearchParams()
  //     if (take !== undefined) params.append('take', take.toString())
  //     if (cursor !== undefined) params.append('cursor', cursor.toString())
  //     if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
  //     // 쿼리스트링 생성
  //     const queryString = params.toString()
  //     const url = `/notice/${queryString ? `?${queryString}` : ''}`
  //     try {
  //       const response = await instance.get<NoticeListResponse>(url)
  //       return response.data
  //     } catch (error) {
  //       console.error('Failed to fetch notice list:', error)
  //       throw error
  //     }
  //   },
  //   getNoticeDetail: async (noticeId: number) => {
  //     try {
  //       const response = await instance.get<NoticeDetailResponse>(`/notice/detail/${noticeId}`)
  //       return response.data
  //     } catch (error) {
  //       console.error('Failed to fetch notice detail:', error)
  //       throw error
  //     }
  //   },

  postNotice: async (notice: NoticePostRequest) => {
    try {
      const response = await instance.post('/notice', notice)
      return response.data
    } catch (error) {
      console.error('Failed to post notice:', error)
      throw error
    }
  },
}
