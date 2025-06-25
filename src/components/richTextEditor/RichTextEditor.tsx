import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
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

const RichTextEditor = ({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  height = '400px',
  className,
  readOnly = false,
  theme = 'snow',
}: RichTextEditorProps) => {
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
        theme={theme}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{
          height: height,
          marginBottom: readOnly ? '0' : '50px', // 읽기 전용일 때는 여백 제거
        }}
      />
    </div>
  )
}

export default RichTextEditor
