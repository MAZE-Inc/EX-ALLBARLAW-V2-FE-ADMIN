import ContentForm from '@/components/contentForm/ContentForm'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { message } from 'antd'
import { NoticeDetailType } from '@/types/noticeTypes'
import { ROUTE_PATH } from '@/routes/routePath'
import { usePostNotice } from '@/hooks/mutations/usePostNotice'

const NoticeEditPage = () => {
  const navigate = useNavigate()
  const { noticeId } = useParams()
  const location = useLocation()
  const isEditMode = Boolean(noticeId)
  const { mutate: postNotice } = usePostNotice()

  const [loading, setLoading] = useState(false)
  const [noticeData, setNoticeData] = useState<NoticeDetailType | null>(null)

  useEffect(() => {
    if (isEditMode) {
      // 수정 모드: 무조건 DetailPage에서 데이터를 전달받아야 함
      const passedData = location.state?.noticeData as NoticeDetailType | undefined

      if (passedData) {
        setNoticeData(passedData)
      } else {
        // 데이터가 없으면 잘못된 접근
        message.error('잘못된 접근입니다. 목록에서 다시 시도해주세요.')
        navigate(ROUTE_PATH.BOARD_NOTICE)
      }
    }
  }, [isEditMode, location.state, navigate])

  const handleSave = async (data: { title: string; content: string; radioValue?: string }) => {
    try {
      setLoading(true)

      if (isEditMode) {
        // 수정 API 호출
        console.log('수정할 데이터:', { noticeId, ...data })
        // TODO: await updateNotice(noticeId, data)
        message.success('공지사항이 수정되었습니다.')
      } else {
        // 등록 API 호출
        console.log('등록할 데이터:', data)
        postNotice({
          noticeTypeId: Number(data.radioValue),
          title: data.title,
          content: data.content,
        })

        message.success('공지사항이 등록되었습니다.')
      }

      navigate(ROUTE_PATH.BOARD_NOTICE)
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

  const radioOptions = [
    { label: '공지', value: '1' },
    { label: '업데이트', value: '2' },
    { label: '이벤트', value: '3' },
  ]

  // 카테고리를 라디오 값으로 변환
  const getCategoryRadioValue = (category: string) => {
    switch (category) {
      case '공지사항':
        return 'notice'
      case '업데이트':
        return 'update'
      case '이벤트':
        return 'event'
      default:
        return 'notice'
    }
  }

  return (
    <section style={{ padding: 36 }}>
      <ContentForm
        initialTitle={isEditMode ? noticeData?.title || '' : ''}
        initialContent={isEditMode ? noticeData?.content || '' : ''}
        initialRadioValue={isEditMode ? getCategoryRadioValue(noticeData?.category || '공지사항') : 'notice'}
        titlePlaceholder='공지사항 제목을 입력하세요'
        contentPlaceholder='공지사항 내용을 작성하세요...'
        saveButtonText={isEditMode ? '수정 완료' : '공지 등록'}
        radioLabel='공지 유형'
        showRadio={true}
        radioOptions={radioOptions}
        loading={loading}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </section>
  )
}

export default NoticeEditPage
