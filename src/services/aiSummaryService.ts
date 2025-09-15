import {
  BlogAiSummaryRequest,
  BlogAiSummaryResponse,
  KnowledgeAiTitleResponse,
  VideoAiSummaryResponse,
} from '@/types/aiSummaryTypes'
import axios from 'axios'

export const aiSummaryService = {
  getBlogAiSummary: async (request: BlogAiSummaryRequest) => {
    const { url, category } = request

    const params = new URLSearchParams()
    if (url) params.append('url', url)
    if (category) params.append('category', category)

    const urlPath = `${import.meta.env.VITE_AI_SUMMARY_SERVER_API}/latest/summary/blog?${params.toString()}`

    const response = await axios.get<BlogAiSummaryResponse>(urlPath)
    return response.data
  },
  getVideoAiSummary: async (request: { url: string }) => {
    const { url } = request

    const params = new URLSearchParams()
    if (url) params.append('url', url)

    const urlPath = `${import.meta.env.VITE_AI_SUMMARY_SERVER_API}/latest/summary/youtube?${params.toString()}`

    const response = await axios.get<VideoAiSummaryResponse>(urlPath)
    return response.data
  },
  generateKnowledgeAiTitle: async (request: { text: string }) => {
    const { text } = request

    const urlPath = `${import.meta.env.VITE_AI_SUMMARY_SERVER_API}/latest/knowledge/generate/title`

    const response = await axios.post<KnowledgeAiTitleResponse>(urlPath, { text })
    return response.data
  },
}
