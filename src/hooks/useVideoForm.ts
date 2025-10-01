import { useState } from 'react'

interface VideoFormData {
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
  selectedLawyer?: any
  videoCaseSubscriberCount: number
}

export const useVideoForm = (subCategoryId?: string) => {
  const [formData, setFormData] = useState<VideoFormData>({
    subcategoryId: subCategoryId ? Number(subCategoryId) : 0,
    videoCaseTitle: '',
    videoCaseSummaryContent: '',
    videoCaseSource: '',
    videoCaseThumbnail: '',
    videoCaseChannelDescription: '',
    videoCaseChannelThumbnail: '',
    videoCaseHandleName: '',
    videoCaseChannelName: '',
    videoCaseTags: [] as string[],
    videoCaseLawyerId: 0,
    videoCaseSubscriberCount: 0,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const isFormValid = (isChannelInfoFetched: boolean) => {
    return !!(
      formData.videoCaseSource &&
      formData.videoCaseTitle &&
      formData.videoCaseSummaryContent &&
      formData.videoCaseLawyerId &&
      formData.subcategoryId &&
      isChannelInfoFetched
    )
  }

  return {
    formData,
    setFormData,
    handleInputChange,
    isFormValid,
  }
}
