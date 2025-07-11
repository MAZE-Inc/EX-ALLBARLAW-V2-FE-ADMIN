import ReactQuill, { Quill } from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useEffect, useRef, useCallback } from 'react'
import styles from './rich-text-editor.module.scss'
import apiClient from '@/lib/axios'
// Quill 모듈 등록
const Parchment = Quill.import('parchment')

// 이미지 리사이즈 모듈 동적 임포트
const loadImageResize = async () => {
  try {
    const ImageResize = (await import('quill-image-resize-module-react')).default
    Quill.register('modules/imageResize', ImageResize)
  } catch (error) {
    console.error('이미지 리사이즈 모듈 로드 실패:', error)
  }
}

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  height?: string
  className?: string
  readOnly?: boolean
  theme?: 'snow' | 'bubble'
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  height = '400px',
  className,
  readOnly = false,
  theme = 'snow',
}: RichTextEditorProps) => {
  const quillRef = useRef<ReactQuill>(null)

  // 이미지 리사이즈 모듈 로드
  useEffect(() => {
    loadImageResize()
  }, [])

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'notice')

      const response = await apiClient.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log(response.data.fileUrl)

      return response.data.fileUrl
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      throw new Error('이미지 업로드에 실패했습니다.')
    }
  }, [])

  // 개발 환경에서만 deprecation 경고 필터링
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const originalWarn = console.warn
      console.warn = (...args) => {
        if (args[0]?.includes?.('DOMNodeInserted')) {
          return
        }
        originalWarn.apply(console, args)
      }

      return () => {
        console.warn = originalWarn
      }
    }
  }, [])

  const modules = {
    toolbar: readOnly
      ? false
      : {
          container: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['clean'],
          ],
          handlers: {
            image: () => {
              const input = document.createElement('input')
              input.setAttribute('type', 'file')
              input.setAttribute('accept', 'image/*')
              input.click()

              input.onchange = async () => {
                const file = input.files?.[0]
                if (file) {
                  try {
                    const url = await handleImageUpload(file)
                    const quillInstance = quillRef.current?.getEditor()
                    const range = quillInstance?.getSelection()
                    if (quillInstance && range) {
                      quillInstance.insertEmbed(range.index, 'image', url)
                    }
                  } catch (error) {
                    console.error('이미지 삽입 실패:', error)
                  }
                }
              }
            },
          },
        },
    imageResize: {
      parchment: Parchment,
      modules: ['Resize', 'DisplaySize'],
    },
  }

  return (
    <div className={`${styles.richTextEditor} ${className || ''}`}>
      <ReactQuill
        ref={quillRef}
        theme={theme}
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{
          height: height,
          marginBottom: readOnly ? '0' : '50px',
        }}
      />
    </div>
  )
}

export default RichTextEditor
