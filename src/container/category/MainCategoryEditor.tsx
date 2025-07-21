import React, { useState } from 'react'
import { Button, Input, Modal } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import styles from './mainCategoryEditor.module.scss'

interface MainCategoryEditorProps {
  title: string
  open: boolean
  onCancel: () => void
  onSubmit: (data: { name: string; onImage: File | null; offImage: File | null }) => void
  defaultValues?: {
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

  React.useEffect(() => {
    if (open) {
      setCategoryName(defaultValues?.name || '')
      setOnImageFile(null)
      setOffImageFile(null)
      setOnImagePreview(defaultValues?.onImage || '')
      setOffImagePreview(defaultValues?.offImage || '')
    }
  }, [open, defaultValues])

  const handleSubmit = () => {
    if (categoryName.trim()) {
      onSubmit({
        name: categoryName,
        onImage: onImageFile,
        offImage: offImageFile,
      })
      // 초기화
      setCategoryName('')
      setOnImageFile(null)
      setOffImageFile(null)
      setOnImagePreview('')
      setOffImagePreview('')
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
            disabled={!categoryName.trim()}
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
