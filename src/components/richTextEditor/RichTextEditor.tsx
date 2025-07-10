import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useEffect, useRef } from 'react'
import styles from './rich-text-editor.module.scss'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  height?: string
  className?: string
  readOnly?: boolean
  theme?: 'snow' | 'bubble'
}

// HTML 포스트 프로세서 - ol을 ul로 변환하는 유틸리티 함수
const fixQuillListHTML = (html: string): string => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // data-list="bullet"인 ol 태그를 찾아서 ul로 변환
  const olElements = doc.querySelectorAll('ol[data-list="bullet"]')
  olElements.forEach(ol => {
    const ul = doc.createElement('ul')
    // 속성 복사
    Array.from(ol.attributes).forEach(attr => {
      ul.setAttribute(attr.name, attr.value)
    })
    // 내용 복사
    ul.innerHTML = ol.innerHTML
    ol.parentNode?.replaceChild(ul, ol)
  })

  return doc.body.innerHTML
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

  // 컨텐츠 변경 핸들러
  const handleChange = (content: string) => {
    const quillInstance = quillRef.current?.getEditor()

    if (quillInstance?.getSemanticHTML) {
      // 1단계: getSemanticHTML로 개선된 HTML 가져오기
      let semanticHTML = quillInstance.getSemanticHTML()

      // 2단계: 포스트 프로세싱으로 남은 문제 해결
      semanticHTML = fixQuillListHTML(semanticHTML)

      onChange(semanticHTML)
    } else {
      onChange(content)
    }
  }

  // Quill 에디터 툴바 설정
  const modules = {
    toolbar: readOnly
      ? false
      : [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
  }

  // 에디터 포맷 설정
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
    'image',
    'video',
  ]

  return (
    <div className={`${styles.richTextEditor} ${className || ''}`}>
      <ReactQuill
        ref={quillRef}
        theme={theme}
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
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
