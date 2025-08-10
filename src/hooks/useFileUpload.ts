import { useState, useCallback } from 'react'
import apiClient from '@/lib/axios'

interface UploadOptions {
  folder?: string
  maxSize?: number // MB 단위
  allowedTypes?: string[] // MIME 타입
}

interface UploadResult {
  fileUrl: string
  fileName?: string
  fileSize?: number
}

interface UseFileUploadReturn {
  uploadFile: (file: File | Blob, options?: UploadOptions) => Promise<UploadResult>
  uploadMultipleFiles: (files: (File | Blob)[], options?: UploadOptions) => Promise<UploadResult[]>
  isUploading: boolean
  uploadProgress: number
  error: Error | null
  reset: () => void
}

const DEFAULT_MAX_SIZE = 10 // 10MB
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']

export const useFileUpload = (): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const validateFile = useCallback((file: File | Blob, options?: UploadOptions): void => {
    const maxSize = options?.maxSize || DEFAULT_MAX_SIZE
    const allowedTypes = options?.allowedTypes || DEFAULT_ALLOWED_TYPES

    // 파일 크기 검증
    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`파일 크기는 ${maxSize}MB를 초과할 수 없습니다.`)
    }

    // 파일 타입 검증
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`허용되지 않는 파일 형식입니다. 허용 형식: ${allowedTypes.join(', ')}`)
    }
  }, [])

  const uploadFile = useCallback(
    async (file: File | Blob, options?: UploadOptions): Promise<UploadResult> => {
      try {
        setIsUploading(true)
        setError(null)
        setUploadProgress(0)

        // 파일 검증
        validateFile(file, options)

        const formData = new FormData()
        formData.append('file', file)
        if (options?.folder) {
          formData.append('folder', options.folder)
        }

        const response = await apiClient.post<UploadResult>('/file/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0
            setUploadProgress(progress)
          },
        })

        setUploadProgress(100)
        return response.data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '파일 업로드에 실패했습니다.'
        const uploadError = new Error(errorMessage)
        setError(uploadError)
        throw uploadError
      } finally {
        setIsUploading(false)
      }
    },
    [validateFile]
  )

  const uploadMultipleFiles = useCallback(
    async (files: (File | Blob)[], options?: UploadOptions): Promise<UploadResult[]> => {
      try {
        setIsUploading(true)
        setError(null)
        setUploadProgress(0)

        // 모든 파일 검증
        files.forEach(file => validateFile(file, options))

        const uploadPromises = files.map(async (file, index) => {
          const formData = new FormData()
          formData.append('file', file)
          if (options?.folder) {
            formData.append('folder', options.folder)
          }

          const response = await apiClient.post<UploadResult>('/file/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const progress = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0
              // 전체 파일 중 현재 파일의 진행률 계산
              const totalProgress = Math.round(((index + progress / 100) / files.length) * 100)
              setUploadProgress(totalProgress)
            },
          })

          return response.data
        })

        const results = await Promise.all(uploadPromises)
        setUploadProgress(100)
        return results
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '파일 업로드에 실패했습니다.'
        const uploadError = new Error(errorMessage)
        setError(uploadError)
        throw uploadError
      } finally {
        setIsUploading(false)
      }
    },
    [validateFile]
  )

  const reset = useCallback(() => {
    setIsUploading(false)
    setUploadProgress(0)
    setError(null)
  }, [])

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    uploadProgress,
    error,
    reset,
  }
}