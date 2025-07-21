import React, { useState } from 'react'
import { Button, Input, Modal } from 'antd'
import styles from './inputModal.module.scss'

interface InputModalProps {
  title: string
  open: boolean
  onCancel: () => void
  onSubmit: (inputValue: string) => void
  placeholder?: string
  label?: string
  submitButtonText?: string
  cancelButtonText?: string
  primaryButtonColor?: string
  inputType?: 'text' | 'textarea'
  maxLength?: number
}

const InputModal: React.FC<InputModalProps> = ({
  title,
  open,
  onCancel,
  onSubmit,
  placeholder = '입력해주세요.',
  label = '입력',
  submitButtonText = '확인',
  cancelButtonText = '취소',
  primaryButtonColor = '#52c41a',
  inputType = 'text',
  maxLength,
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue)
      setInputValue('')
    }
  }

  const handleCancel = () => {
    setInputValue('')
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
            disabled={!inputValue.trim()}
            style={{ backgroundColor: primaryButtonColor, borderColor: primaryButtonColor }}
          >
            {submitButtonText}
          </Button>
        </>
      }
    >
      <div className={styles.inputModal}>
        <label>{label}</label>
        {inputType === 'textarea' ? (
          <Input.TextArea
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            maxLength={maxLength}
            rows={4}
          />
        ) : (
          <Input placeholder={placeholder} value={inputValue} onChange={handleInputChange} maxLength={maxLength} />
        )}
      </div>
    </Modal>
  )
}

export default InputModal
