import React, { useState } from 'react'
import { Button, Input, Modal, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import styles from './mainCategoryEditor.module.scss'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useCreateCategory, useUpdateCategory } from '@/hooks/queries/useCategory'

interface MainCategoryEditorProps {
  title: string
  open: boolean
  onCancel: () => void
  onSubmit: (data: { name: string; onImage: File | null; offImage: File | null }) => void
  defaultValues?: {
    id?: number  // 카테고리 ID 추가 (수정 시 필요)
    name?: string
    onImage?: string
    offImage?: string
  }
}

const MainCategoryEditor: React.FC<MainCategoryEditorProps> = ({ title, open, onCancel, onSubmit, defaultValues }) => {
  const [categoryName, setCategoryName] = useState('')
  const [onImageFile, setOnImageFile] = useState<File | null>(null)
  const [offImageFile, setOffImageFile] = useState<File | null>(null)
  const [onImagePreview, setOnImagePreview] = useState<string>('')
  const [offImagePreview, setOffImagePreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditMode = title.includes('수정') || title.includes('edit')
  
  const { uploadFile } = useFileUpload()
  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()

  React.useEffect(() => {
    if (open) {
      setCategoryName(defaultValues?.name || '')
      setOnImageFile(null)
      setOffImageFile(null)
      setOnImagePreview(defaultValues?.onImage || '')
      setOffImagePreview(defaultValues?.offImage || '')
    }
  }, [open, defaultValues])

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      message.warning('대분류 이름을 입력해주세요.')
      return
    }

    // 수정 모드에서는 이미지가 없어도 기존 이미지 사용
    if (!isEditMode && (!onImageFile || !offImageFile)) {
      message.warning('ON 이미지와 OFF 이미지를 모두 등록해주세요.')
      return
    }
    
    if (isEditMode && !defaultValues?.id) {
      message.error('카테고리 ID가 없습니다.')
      return
    }

    try {
      setIsSubmitting(true)
      
      let onImageUrl = defaultValues?.onImage || ''
      let offImageUrl = defaultValues?.offImage || ''
      
      // 새 이미지가 있으면 업로드
      if (onImageFile || offImageFile) {
        const uploadPromises = []
        
        if (onImageFile) {
          uploadPromises.push(
            uploadFile(onImageFile, {
              folder: 'category-clicked',
              allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
              maxSize: 5,
            })
          )
        }
        
        if (offImageFile) {
          uploadPromises.push(
            uploadFile(offImageFile, {
              folder: 'category-nonClicked',
              allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
              maxSize: 5,
            })
          )
        }
        
        const uploadResults = await Promise.all(uploadPromises)
        
        // 업로드 결과 처리
        if (onImageFile && uploadResults[0]) {
          onImageUrl = uploadResults[0].fileUrl
        }
        if (offImageFile) {
          const resultIndex = onImageFile ? 1 : 0
          if (uploadResults[resultIndex]) {
            offImageUrl = uploadResults[resultIndex].fileUrl
          }
        }
      }

      if (isEditMode) {
        // 수정 모드
        await updateCategoryMutation.mutateAsync({
          categoryId: defaultValues!.id!,
          category: {
            categoryName: categoryName,
            categoryImageUrl: offImageUrl,        // OFF 이미지가 기본 이미지
            categoryClickedImageUrl: onImageUrl,  // ON 이미지가 클릭된 이미지
          },
        })
        message.success('대분류가 성공적으로 수정되었습니다.')
      } else {
        // 생성 모드
        const response = await createCategoryMutation.mutateAsync({
          categoryName: categoryName,
          categoryImageUrl: offImageUrl,        // OFF 이미지가 기본 이미지
          categoryClickedImageUrl: onImageUrl,  // ON 이미지가 클릭된 이미지
        })
        message.success('대분류가 성공적으로 등록되었습니다.')

        // 성공 시 부모 컴포넌트의 onSubmit 호출 (생성된 카테고리 ID 포함)
        onSubmit({
          name: categoryName,
          onImage: onImageFile,
          offImage: offImageFile,
          categoryId: response.data.categoryId, // 새로 생성된 카테고리 ID 추가
        })
      }

      // 수정 모드일 때는 ID 없이 호출
      if (isEditMode) {
        onSubmit({
          name: categoryName,
          onImage: onImageFile,
          offImage: offImageFile,
        })
      }
      
      // 초기화
      setCategoryName('')
      setOnImageFile(null)
      setOffImageFile(null)
      setOnImagePreview('')
      setOffImagePreview('')
    } catch (error) {
      console.error('카테고리 등록 실패:', error)
      message.error(error instanceof Error ? error.message : '카테고리 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setCategoryName('')
    setOnImageFile(null)
    setOffImageFile(null)
    setOnImagePreview('')
    setOffImagePreview('')
    onCancel()
  }

  const handleOnImageChange = (file: File) => {
    setOnImageFile(file)
    // 미리보기를 위한 URL 생성
    const reader = new FileReader()
    reader.onload = e => {
      setOnImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleOffImageChange = (file: File) => {
    setOffImageFile(file)
    // 미리보기를 위한 URL 생성
    const reader = new FileReader()
    reader.onload = e => {
      setOffImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleOnImageUpload = (info: any) => {
    const file = info.target.files?.[0]
    if (file) {
      handleOnImageChange(file)
    }
  }

  const handleOffImageUpload = (info: any) => {
    const file = info.target.files?.[0]
    if (file) {
      handleOffImageChange(file)
    }
  }

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleCancel}
      width={700}
      footer={
        <>
          <Button onClick={handleCancel}>취소</Button>
          <Button
            type='primary'
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!categoryName.trim() || (!isEditMode && (!onImageFile || !offImageFile)) || isSubmitting}
            style={{ backgroundColor: '#20bf62', borderColor: '#20bf62' }}
          >
            저장
          </Button>
        </>
      }
    >
      <div className={styles.mainCategoryEditor}>
        <div className={styles.formRow}>
          <label>대분류 이름</label>
          <Input
            placeholder='대분류 이름을 입력해주세요.'
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />
        </div>

        <div className={styles.formRow}>
          <label>ON 이미지 등록</label>
          <div className={styles.imageUploadContainer}>
            <div className={styles.imagePreview}>
              {onImagePreview ? (
                <img src={onImagePreview} alt='ON 이미지 미리보기' />
              ) : (
                <div className={styles.noImage}>이미지가 없습니다</div>
              )}
            </div>
            <div className={styles.uploadButtonContainer}>
              <input
                type='file'
                id='onImageInput'
                accept='image/*'
                onChange={handleOnImageUpload}
                style={{ display: 'none' }}
              />
              <Button icon={<UploadOutlined />} onClick={() => document.getElementById('onImageInput')?.click()}>
                이미지 선택
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <label>OFF 이미지 등록</label>
          <div className={styles.imageUploadContainer}>
            <div className={styles.imagePreview}>
              {offImagePreview ? (
                <img src={offImagePreview} alt='OFF 이미지 미리보기' />
              ) : (
                <div className={styles.noImage}>이미지가 없습니다</div>
              )}
            </div>
            <div className={styles.uploadButtonContainer}>
              <input
                type='file'
                id='offImageInput'
                accept='image/*'
                onChange={handleOffImageUpload}
                style={{ display: 'none' }}
              />
              <Button icon={<UploadOutlined />} onClick={() => document.getElementById('offImageInput')?.click()}>
                이미지 선택
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default MainCategoryEditor
