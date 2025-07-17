import ContentForm from '@/components/contentForm/ContentForm'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { message } from 'antd'
import { NoticeDetailResponse } from '@/types/boardTypes'
import { ROUTE_PATH } from '@/routes/routePath'
import { usePostNotice } from '@/hooks/mutations/usePostNotice'
import { useReadNoticeType, useUpdateNotice } from '@/hooks/queries/useNotice'

const NoticeEditPage = () => {
  const navigate = useNavigate()
  const { noticeId } = useParams()
  const location = useLocation()
  const isEditMode = Boolean(noticeId)
  const { mutate: postNotice } = usePostNotice()
  const { mutate: updateNotice } = useUpdateNotice()
  const { noticeTypeResponse } = useReadNoticeType()

  const [loading, setLoading] = useState(false)
  const [noticeData, setNoticeData] = useState<NoticeDetailResponse | null>(null)

  useEffect(() => {
    if (isEditMode) {
      // console.log('Location State:', location.state)
      const passedData = location.state?.noticeDetail as NoticeDetailResponse | undefined
      // console.log('Passed Data:', passedData)

      if (passedData) {
        setNoticeData(passedData)
      } else {
        message.error('잘못된 접근입니다. 목록에서 다시 시도해주세요.')
        navigate(ROUTE_PATH.BOARD_NOTICE)
      }
    }
  }, [isEditMode, location.state, navigate])

  // console.log('Notice Data:', noticeData)

  const handleSave = async (data: { title: string; content: string; radioValue?: string }) => {
    try {
      setLoading(true)

      if (isEditMode && noticeId) {
        updateNotice(
          {
            noticeId: Number(noticeId),
            notice: {
              noticeTypeId: Number(data.radioValue),
              title: data.title,
              content: data.content,
            },
          },
          {
            onSuccess: () => {
              window.history.replaceState(null, '', window.location.pathname.replace('/edit', ''))
              navigate(-1)
            },
            onError: () => {
              message.error('수정에 실패했습니다.')
            },
            onSettled: () => {
              setLoading(false)
            },
          }
        )
      } else {
        postNotice(
          {
            noticeTypeId: Number(data.radioValue),
            title: data.title,
            content: data.content,
          },
          {
            onSuccess: () => {
              message.success('공지사항이 등록되었습니다.')
              window.history.replaceState(null, '', window.location.pathname.replace('/edit', ''))
              navigate(-1)
            },
            onError: () => {
              message.error('등록에 실패했습니다.')
            },
            onSettled: () => {
              setLoading(false)
            },
          }
        )
      }
    } catch (error) {
      console.error('저장 실패:', error)
      message.error(isEditMode ? '수정에 실패했습니다.' : '등록에 실패했습니다.')
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  // noticeTypeResponse를 라디오 옵션 형태로 변환
  const radioOptions = noticeTypeResponse?.map((type: any) => ({
    label: type.noticeTypeName,
    value: String(type.noticeTypeId),
  }))

  return (
    <section style={{ padding: 36 }}>
      <ContentForm
        initialTitle={isEditMode && noticeData ? noticeData.noticeTitle : ''}
        initialContent={isEditMode && noticeData ? noticeData.noticeContent : ''}
        initialRadioValue={isEditMode && noticeData ? String(noticeData.noticeTypeId) : '1'}
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
