import React, { useState, useRef } from 'react'
import { Input } from 'antd'
import styles from './tagInput.module.scss'

type TagInputProps = {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  disabled?: boolean
  isLoading?: boolean
  status?: 'error' | 'warning' | undefined
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = '키워드를 입력하고 엔터를 누르세요',
  maxTags = 10,
  disabled = false,
  isLoading = false,
  status
}) => {
  const [inputValue, setInputValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef<any>(null)

  const handleAddTag = (value: string) => {
    const trimmedValue = value.trim()
    if (!trimmedValue) return

    if (tags.length >= maxTags) {
      setErrorMessage(`최대 ${maxTags}개까지 등록 가능합니다.`)
      setTimeout(() => setErrorMessage(''), 3000)
      return
    }

    if (tags.includes(trimmedValue)) {
      setErrorMessage('동일한 태그는 등록할 수 없습니다')
      setTimeout(() => setErrorMessage(''), 3000)
      setInputValue('')
      return
    }

    onChange([...tags, trimmedValue])
    setInputValue('')
    setErrorMessage('')
  }

  const handleRemoveTag = (indexToRemove: number) => {
    if (disabled || isLoading) return
    onChange(tags.filter((_, index) => index !== indexToRemove))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // 쉼표가 입력되면 태그 추가
    if (value.includes(',')) {
      const tagValue = value.replace(',', '').trim()
      if (tagValue) {
        handleAddTag(tagValue)
      } else {
        setInputValue('')
      }
      return
    }

    setInputValue(value)
  }

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag(inputValue)
    }
  }

  const getPlaceholder = () => {
    if (isLoading) return 'AI 요약중입니다...'
    if (tags.length > 0) return `(${tags.length}/${maxTags})`
    return `${placeholder} (${tags.length}/${maxTags})`
  }

  return (
    <div className={styles['tags-container']}>
      <div
        className={`${styles['tags-input-wrapper']} ${errorMessage || status === 'error' ? styles['error'] : ''} ${disabled ? styles['disabled'] : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, index) => (
          <span key={index} className={styles['tag-item']}>
            #{tag}
            <button
              type='button'
              className={styles['tag-remove']}
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveTag(index)
              }}
              aria-label={`${tag} 태그 삭제`}
              disabled={disabled || isLoading}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          placeholder={getPlaceholder()}
          disabled={tags.length >= maxTags || disabled || isLoading}
          className={styles['tag-input']}
        />
      </div>
      {errorMessage && (
        <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export default TagInput
