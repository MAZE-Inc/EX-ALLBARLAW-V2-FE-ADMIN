import { useParams, useNavigate } from 'react-router-dom'
import { Button, Space, Modal } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Viewer } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'

import { ROUTE_PATH } from '@/routes/routePath'
import { useGetNoticeDetail } from '@/hooks/queries/useGetNotice'
import { useDeleteNotice } from '@/hooks/mutations/useNotice'
import styles from './notice-detail.module.scss'

const NoticeDetailPage = () => {
  const { noticeId } = useParams()
  const navigate = useNavigate()
  const { mutate: deleteNotice } = useDeleteNotice()

  const { data: noticeDetail, isPending } = useGetNoticeDetail(Number(noticeId))

  const handleEdit = () => {
    console.log('Sending notice detail:', noticeDetail)
    navigate(`${ROUTE_PATH.BOARD_NOTICE}/${ROUTE_PATH.BOARD_NOTICE_EDIT}/${noticeId}`, {
      state: { noticeDetail },
    })
  }

  const handleDelete = () => {
    Modal.confirm({
      title: '공지사항 삭제',
      content: '이 공지사항을 삭제하시겠습니까?',
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: () => {
        deleteNotice(Number(noticeId), {
          onSuccess: () => {
            navigate(ROUTE_PATH.BOARD_NOTICE)
          },
        })
      },
    })
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (isPending) {
    return <div style={{ padding: 36, textAlign: 'center' }}>로딩 중...</div>
  }

  if (!noticeDetail) {
    return <div style={{ padding: 36, textAlign: 'center' }}>공지사항을 찾을 수 없습니다.</div>
  }

  return (
    <section className={styles.noticeDetail}>
      {/* 상단 액션 버튼 */}
      <div className={styles.noticeDetail__actions}>
        <Space>
          <Button icon={<EditOutlined />} onClick={handleEdit}>
            수정
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
            삭제
          </Button>
        </Space>
      </div>

      {/* 공지사항 내용 */}
      <div className={styles.noticeDetail__content}>
        <div className={styles.noticeDetail__header}>
          <h1>{noticeDetail.noticeTitle}</h1>
          <div className={styles.noticeDetail__meta}>
            <span className={styles.noticeDetail__category}>
              {noticeDetail.noticeTypeId === 1 ? '공지사항' : noticeDetail.noticeTypeId === 2 ? '업데이트' : '이벤트'}
            </span>
            <span className={styles.noticeDetail__date}>{noticeDetail.noticeCreatedAt}</span>
          </div>
        </div>
        <div className={styles.noticeDetail__body}>
          <Viewer initialValue={noticeDetail.noticeContent} />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className={styles.noticeDetail__footer}>
        <Button onClick={handleBack}>목록으로</Button>
      </div>
    </section>
  )
}

export default NoticeDetailPage
