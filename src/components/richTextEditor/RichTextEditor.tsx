import { useEffect, useRef, useCallback } from 'react'
import { Editor } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import styles from './rich-text-editor.module.scss'
import apiClient from '@/lib/axios'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  height?: string
  className?: string
  theme?: 'light' | 'dark'
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  height = '400px',
  className,
  theme = 'light',
}: RichTextEditorProps) => {
  const editorRef = useRef<Editor>(null)

  // 초기 내용 설정
  useEffect(() => {
    // console.log('Editor value changed:', value)
    const editorInstance = editorRef.current?.getInstance()
    if (editorInstance) {
      const currentContent = editorInstance.getHTML()
      if (value && value !== currentContent) {
        editorInstance.setHTML(value)
      }
    }
  }, [value])

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(async (blob: Blob, callback: (url: string, alt: string) => void) => {
    try {
      const formData = new FormData()
      formData.append('file', blob)
      formData.append('folder', 'notice')

      const response = await apiClient.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      callback(response.data.fileUrl, 'image')
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
    }
  }, [])

  // 에디터 변경 핸들러
  const handleChange = useCallback(() => {
    const editorInstance = editorRef.current?.getInstance()
    if (editorInstance) {
      const content = editorInstance.getHTML()
      onChange(content)
    }
  }, [onChange])

  return (
    <div className={`${styles.richTextEditor} ${className || ''}`}>
      <Editor
        ref={editorRef}
        initialValue={value}
        placeholder={placeholder}
        height={height}
        theme={theme}
        onChange={handleChange}
        initialEditType='wysiwyg'
        previewStyle='tab'
        usageStatistics={false}
        hooks={{
          addImageBlobHook: handleImageUpload,
        }}
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task'],
          ['table', 'image', 'link'],
        ]}
      />
    </div>
  )
}

export default RichTextEditor
