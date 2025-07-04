import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button, Space, message } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import ContentForm from '@/components/contentForm/ContentForm'
import { NoticeDetailType } from '@/types/noticeTypes'
import { ROUTE_PATH } from '@/routes/routePath'

const NoticeDetailPage = () => {
  const { noticeId } = useParams()
  const navigate = useNavigate()
  const [noticeData, setNoticeData] = useState<NoticeDetailType | null>(null)
  const [loading, setLoading] = useState(true)

  // 임시 데이터 (실제로는 API에서 가져올 데이터)
  useEffect(() => {
    // TODO: API 호출로 실제 데이터 가져오기
    const fetchNoticeDetail = async () => {
      try {
        // 임시 데이터
        const mockData: NoticeDetailType = {
          noticeId: Number(noticeId),
          category: '공지사항',
          title: `공지사항 ${noticeId} 제목`,
          content: `<p>이것은 공지사항 ${noticeId}의 상세 내용입니다.</p><p><strong>중요한 내용</strong>이 포함되어 있습니다.</p>`,
          createdAt: '2025-01-01',
        }

        setTimeout(() => {
          setNoticeData(mockData)
          setLoading(false)
        }, 500) // 로딩 시뮬레이션
      } catch (error) {
        console.error('공지사항 조회 실패:', error)
        message.error('공지사항을 불러오는데 실패했습니다.')
        setLoading(false)
      }
    }

    if (noticeId) {
      fetchNoticeDetail()
    }
  }, [noticeId])

  const handleEdit = () => {
    navigate(`${ROUTE_PATH.BOARD_NOTICE}/edit/${noticeId}`, {
      state: { noticeData }, // 현재 데이터를 state로 전달
    })
  }

  const handleDelete = () => {
    // TODO: 삭제 확인 모달 및 API 호출
    message.success('공지사항이 삭제되었습니다.')
    navigate(ROUTE_PATH.BOARD_NOTICE)
  }

  const handleFormCancel = () => {
    navigate(-1)
  }

  const radioOptions = [
    { label: '공지', value: 'notice' },
    { label: '업데이트', value: 'update' },
    { label: '이벤트', value: 'event' },
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

  if (loading) {
    return <div style={{ padding: 36, textAlign: 'center' }}>로딩 중...</div>
  }

  if (!noticeData) {
    return <div style={{ padding: 36, textAlign: 'center' }}>공지사항을 찾을 수 없습니다.</div>
  }

  return (
    <section style={{ padding: 36 }}>
      {/* 상단 액션 버튼 */}
      <div style={{ marginBottom: 20, textAlign: 'right' }}>
        <Space>
          <Button icon={<EditOutlined />} onClick={handleEdit}>
            수정
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
            삭제
          </Button>
        </Space>
      </div>

      {/* ContentForm 읽기 전용 모드 */}
      <ContentForm
        initialTitle={noticeData.title}
        initialContent={noticeData.content}
        initialRadioValue={getCategoryRadioValue(noticeData.category)}
        titlePlaceholder=''
        contentPlaceholder=''
        cancelButtonText='목록으로'
        radioLabel='공지 유형'
        showRadio={true}
        radioOptions={radioOptions}
        readOnly={true}
        onSave={() => {}} // 읽기 전용이므로 빈 함수
        onCancel={handleFormCancel}
      />
    </section>
  )
}

export default NoticeDetailPage
