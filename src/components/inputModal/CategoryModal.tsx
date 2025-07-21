import React, { useState } from 'react'
import { Button, Input, Modal } from 'antd'
import styles from './categoryModal.module.scss'

interface CategoryModalProps {
  title: string
  open: boolean
  onCancel: () => void
  onSubmit: (categoryName: string) => void
  placeholder?: string
  label?: string
  submitButtonText?: string
  cancelButtonText?: string
  primaryButtonColor?: string
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  title,
  open,
  onCancel,
  onSubmit,
  placeholder = '분류를 입력해주세요.',
  label = '분류 등록',
  submitButtonText = '등록하기',
  cancelButtonText = '취소',
  primaryButtonColor = '#52c41a',
}) => {
  const [categoryInput, setCategoryInput] = useState('')

  const handleCategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryInput(e.target.value)
  }

  const handleSubmit = () => {
    if (categoryInput.trim()) {
      onSubmit(categoryInput)
      setCategoryInput('')
    }
  }

  const handleCancel = () => {
    setCategoryInput('')
    onCancel()
  }

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleCancel}
      footer={
        <>
          <Button onClick={handleCancel}>{cancelButtonText}</Button>
          <Button
            type='primary'
            onClick={handleSubmit}
            disabled={!categoryInput.trim()}
            style={{ backgroundColor: primaryButtonColor, borderColor: primaryButtonColor }}
          >
            {submitButtonText}
          </Button>
        </>
      }
    >
      <div className={styles.categoryModal}>
        <label>{label}</label>
        <Input placeholder={placeholder} value={categoryInput} onChange={handleCategoryInput} />
      </div>
    </Modal>
  )
}

export default CategoryModal
