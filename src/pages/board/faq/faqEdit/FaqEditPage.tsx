import { Button, Form, Input, Select, Space } from 'antd'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { message } from 'antd'
import { ROUTE_PATH } from '@/routes/routePath'
import styles from './faqEdit.module.scss'

const { TextArea } = Input

interface FaqDetailResponse {
  id: number
  category: string
  question: string
  answer: string
}

const FaqEditPage = () => {
  const navigate = useNavigate()
  const { faqId } = useParams()
  const location = useLocation()
  const isEditMode = Boolean(faqId)
  const [form] = Form.useForm()

  const [loading, setLoading] = useState(false)
  const [faqData, setFaqData] = useState<FaqDetailResponse | null>(null)

  useEffect(() => {
    if (isEditMode) {
      console.log('Location State:', location.state)
      const passedData = location.state?.faqDetail as FaqDetailResponse | undefined
      console.log('Passed Data:', passedData)

      if (passedData) {
        setFaqData(passedData)
        form.setFieldsValue({
          category: passedData.category,
          question: passedData.question,
          answer: passedData.answer,
        })
      } else {
        message.error('잘못된 접근입니다. 목록에서 다시 시도해주세요.')
        navigate(ROUTE_PATH.BOARD_FAQ)
      }
    }
  }, [isEditMode, location.state, navigate, form])

  console.log('FAQ Data:', faqData)

  const handleSave = async (values: { category: string; question: string; answer: string }) => {
    try {
      setLoading(true)

      if (isEditMode && faqId) {
        // TODO: FAQ 수정 API 호출
        console.log('FAQ 수정:', {
          faqId: Number(faqId),
          category: values.category,
          question: values.question,
          answer: values.answer,
        })

        message.success('FAQ가 수정되었습니다.')
        navigate(ROUTE_PATH.BOARD_FAQ)
      } else {
        // TODO: FAQ 등록 API 호출
        console.log('FAQ 등록:', {
          category: values.category,
          question: values.question,
          answer: values.answer,
        })

        message.success('FAQ가 등록되었습니다.')
        navigate(ROUTE_PATH.BOARD_FAQ)
      }
    } catch (error) {
      console.error('저장 실패:', error)
      message.error(isEditMode ? '수정에 실패했습니다.' : '등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const categoryOptions = [
    { label: '회원가입', value: '회원가입' },
    { label: '로그인', value: '로그인' },
    { label: '결제', value: '결제' },
    { label: '서비스 이용', value: '서비스 이용' },
    { label: '기타', value: '기타' },
  ]

  return (
    <div className={styles.faqEditPage}>
      <section className={styles.faqEditPage__form}>
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>FAQ 분류</label>
          </div>
          <div className={styles.inputCol}>
            <Select
              placeholder='FAQ 분류를 선택해주세요'
              options={categoryOptions}
              size='large'
              className={styles.selectInput}
              value={form.getFieldValue('category')}
              onChange={value => form.setFieldValue('category', value)}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>질문</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='FAQ 질문을 입력하세요'
              size='large'
              className={styles.titleInput}
              value={form.getFieldValue('question')}
              onChange={e => form.setFieldValue('question', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>답변</label>
          </div>
          <div className={styles.inputCol}>
            <TextArea
              placeholder='FAQ 답변을 작성하세요...'
              rows={8}
              size='large'
              className={styles.answerInput}
              value={form.getFieldValue('answer')}
              onChange={e => form.setFieldValue('answer', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.faqEditPage__actions}>
          <Space className={styles.buttonSpace}>
            <Button onClick={handleCancel} size='large' className={styles.cancelButton}>
              취소
            </Button>
            <Button
              type='primary'
              loading={loading}
              size='large'
              className={styles.saveButton}
              onClick={() => {
                const values = form.getFieldsValue()
                if (values.category && values.question && values.answer) {
                  handleSave(values)
                } else {
                  message.error('모든 필드를 입력해주세요.')
                }
              }}
            >
              {isEditMode ? '수정 완료' : 'FAQ 등록'}
            </Button>
          </Space>
        </div>
      </section>
    </div>
  )
}

export default FaqEditPage
