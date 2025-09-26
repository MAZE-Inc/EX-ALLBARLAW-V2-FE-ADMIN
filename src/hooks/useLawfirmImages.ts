import { useState, useCallback } from 'react'
import { message } from 'antd'
import { useFileUpload } from '@/hooks/useFileUpload'

interface ImageItem {
  id: number
  imageUrl: string
}

export const useLawfirmImages = (initialImages?: ImageItem[]) => {
  const [localImages, setLocalImages] = useState<ImageItem[]>(initialImages || [])
  const [logoImageUrl, setLogoImageUrl] = useState<string>('')
  const { uploadFile, uploadMultipleFiles, isUploading } = useFileUpload()

  // 로고 업로드 핸들러
  const handleLogoUpload = useCallback(async (file: File) => {
    try {
      const result = await uploadFile(file, {
        folder: 'lawfirm/logo',
        maxSize: 10,
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      })
      setLogoImageUrl(result.fileUrl)
      message.success('로고가 업로드되었습니다.')
      return result.fileUrl
    } catch {
      message.error('로고 업로드에 실패했습니다.')
      return null
    }
  }, [uploadFile])

  // 로고 제거 핸들러
  const handleLogoRemove = useCallback(() => {
    setLogoImageUrl('')
  }, [])

  // 단일 이미지 업로드 핸들러
  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const result = await uploadFile(file, {
        folder: 'lawfirm/images',
        maxSize: 10,
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      })
      const newImage = {
        id: Date.now() + Math.random(),
        imageUrl: result.fileUrl,
      }
      setLocalImages(prev => [...prev, newImage])
      message.success('이미지가 업로드되었습니다.')
      return newImage
    } catch {
      message.error('이미지 업로드에 실패했습니다.')
      return null
    }
  }, [uploadFile])

  // 다중 이미지 업로드 핸들러
  const handleMultipleImageUpload = useCallback(async (files: File[]) => {
    try {
      const results = await uploadMultipleFiles(files, {
        folder: 'lawfirm/images',
        maxSize: 10,
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      })
      const newLocalImages = results.map(result => ({
        id: Date.now() + Math.random(),
        imageUrl: result.fileUrl,
      }))
      setLocalImages(prev => [...prev, ...newLocalImages])
      message.success(`${files.length}개의 이미지가 업로드되었습니다.`)
      return newLocalImages
    } catch {
      message.error('이미지 업로드에 실패했습니다.')
      return []
    }
  }, [uploadMultipleFiles])

  // 이미지 제거 핸들러
  const handleImageRemove = useCallback((id: number) => {
    setLocalImages(prev => prev.filter(img => img.id !== id))
  }, [])

  // 이미지 목록을 API 형식으로 변환
  const getImagesForSubmit = useCallback(() => {
    return localImages.map(img => ({ imageUrl: img.imageUrl }))
  }, [localImages])

  // 초기 이미지 설정
  const initializeImages = useCallback((images: ImageItem[], logoUrl?: string) => {
    setLocalImages(images)
    if (logoUrl) {
      setLogoImageUrl(logoUrl)
    }
  }, [])

  return {
    localImages,
    logoImageUrl,
    isUploading,
    handleLogoUpload,
    handleLogoRemove,
    handleImageUpload,
    handleMultipleImageUpload,
    handleImageRemove,
    getImagesForSubmit,
    initializeImages,
  }
}