import { useState, useEffect } from 'react'
import { Button, Input, Space, Radio, Row, Col } from 'antd'
import RichTextEditor from '@/components/richTextEditor/RichTextEditor'
import { Viewer } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import styles from './content-form.module.scss'

interface RadioOption {
  label: string
  value: string
}

interface ContentFormProps {
  initialTitle?: string
  initialContent?: string
  initialRadioValue?: string

  titleLabel?: string
  contentLabel?: string
  radioLabel?: string

  titlePlaceholder?: string
  contentPlaceholder?: string

  saveButtonText?: string
  cancelButtonText?: string

  onSave: (data: { title: string; content: string; radioValue?: string }) => void
  onCancel: () => void

  editorHeight?: string
  loading?: boolean

  // 라디오 옵션
  radioOptions?: RadioOption[]
  showRadio?: boolean

  className?: string
  readOnly?: boolean
}

const ContentForm = ({
  initialTitle = '',
  initialContent = '',
  initialRadioValue = '',
  titleLabel = '제목',
  contentLabel = '내용',
  radioLabel = '분류',
  titlePlaceholder = '제목을 입력하세요',
  contentPlaceholder = '내용을 작성하세요...',
  saveButtonText = '저장',
  cancelButtonText = '취소',
  onSave,
  onCancel,
  editorHeight = '400px',
  loading = false,
  radioOptions = [],
  showRadio = false,
  className,
  readOnly = false,
}: ContentFormProps) => {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [radioValue, setRadioValue] = useState(initialRadioValue)

  // 초기값이 변경될 때 상태 업데이트
  useEffect(() => {
    // console.log('Initial values changed:', { initialTitle, initialContent, initialRadioValue })
    setTitle(initialTitle)
    setContent(initialContent)
    setRadioValue(initialRadioValue)
  }, [initialTitle, initialContent, initialRadioValue])

  const handleSave = () => {
    if (readOnly) return // 읽기 전용일 때는 저장 불가

    const data: { title: string; content: string; radioValue?: string } = {
      title,
      content,
    }

    if (showRadio) {
      data.radioValue = radioValue
    }

    onSave(data)
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <div className={`${styles.contentForm} ${className}`}>
      <Space direction='vertical' size='large' className={styles.formContainer}>
        {showRadio && radioOptions.length > 0 && (
          <Row className={styles.formRow}>
            <Col span={3} className={styles.labelCol}>
              <label className={styles.label}>{radioLabel}</label>
            </Col>
            <Col span={21} className={styles.inputCol}>
              <Radio.Group
                value={radioValue}
                onChange={readOnly ? undefined : e => setRadioValue(e.target.value)}
                className={styles.radioGroup}
                disabled={readOnly}
              >
                <Space size='large' className={styles.radioContainer}>
                  {radioOptions.map(option => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Col>
          </Row>
        )}

        {/* 제목 */}
        <Row className={styles.formRow}>
          <Col span={3} className={styles.labelCol}>
            <label className={styles.label}>{titleLabel}</label>
          </Col>
          <Col span={21} className={styles.inputCol}>
            <Input
              placeholder={titlePlaceholder}
              value={title}
              onChange={readOnly ? undefined : e => setTitle(e.target.value)}
              size='large'
              className={styles.titleInput}
              readOnly={readOnly}
            />
          </Col>
        </Row>

        {/* 내용 에디터 */}
        <Row className={styles.formRow}>
          <Col span={3} className={styles.labelCol}>
            <label className={styles.label}>{contentLabel}</label>
          </Col>
          <Col span={21} className={styles.inputCol}>
            <div className={`${styles.editorContainer} ${readOnly ? styles.readOnly : ''}`}>
              {readOnly ? (
                <Viewer initialValue={content} />
              ) : (
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder={contentPlaceholder}
                  height={editorHeight}
                />
              )}
            </div>
          </Col>
        </Row>

        {/* 버튼 영역 */}
        <div className={styles.buttonContainer}>
          <Space className={styles.buttonSpace}>
            <Button onClick={handleCancel} disabled={loading} className={styles.cancelButton}>
              {cancelButtonText}
            </Button>
            {!readOnly && (
              <Button type='primary' onClick={handleSave} loading={loading} className={styles.saveButton}>
                {saveButtonText}
              </Button>
            )}
          </Space>
        </div>
      </Space>
    </div>
  )
}

export default ContentForm
