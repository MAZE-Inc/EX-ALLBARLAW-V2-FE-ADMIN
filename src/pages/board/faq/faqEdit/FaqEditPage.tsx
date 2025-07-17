import { Button, Form, Input, Select, Space } from 'antd'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { message } from 'antd'
import { ROUTE_PATH } from '@/routes/routePath'
import styles from './faqEdit.module.scss'
import { useGetFaqType } from '@/hooks/queries/useFaq'

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
  const { data: categoryOptions, isLoading } = useGetFaqType()

  const [loading, setLoading] = useState(false)
  const [_faqData, setFaqData] = useState<FaqDetailResponse | null>(null)
  const [formData, setFormData] = useState({
    category: '',
    question: '',
    answer: '',
  })

  useEffect(() => {
    if (isEditMode) {
      console.log('Location State:', location.state)
      const passedData = location.state?.faqDetail as FaqDetailResponse | undefined
      console.log('Passed Data:', passedData)

      if (passedData) {
        setFaqData(passedData)
        const initialData = {
          category: passedData.category,
          question: passedData.question,
          answer: passedData.answer,
        }
        setFormData(initialData)
        form.setFieldsValue(initialData)
      } else {
        message.error('잘못된 접근입니다. 목록에서 다시 시도해주세요.')
        navigate(ROUTE_PATH.BOARD_FAQ)
      }
    }
  }, [isEditMode, location.state, navigate, form])

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
              value={formData.category}
              onChange={value => {
                const newData = { ...formData, category: value }
                setFormData(newData)
                form.setFieldValue('category', value)
              }}
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
              value={formData.question}
              onChange={e => {
                const newData = { ...formData, question: e.target.value }
                setFormData(newData)
                form.setFieldValue('question', e.target.value)
              }}
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
              value={formData.answer}
              onChange={e => {
                const newData = { ...formData, answer: e.target.value }
                setFormData(newData)
                form.setFieldValue('answer', e.target.value)
              }}
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
              disabled={!formData.category.trim() || !formData.question.trim() || !formData.answer.trim()}
              onClick={() => {
                if (formData.category.trim() && formData.question.trim() && formData.answer.trim()) {
                  handleSave(formData)
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
