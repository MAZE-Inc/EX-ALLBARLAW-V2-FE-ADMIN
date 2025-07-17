import { useParams, useNavigate } from 'react-router-dom'
import { Button, Space, Modal, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Viewer } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'

import { ROUTE_PATH } from '@/routes/routePath'
import { useGetNoticeDetail } from '@/hooks/queries/useGetNotice'
import { useDeleteNotice } from '@/hooks/mutations/useNotice'
import styles from './notice-detail.module.scss'
import dayjs from 'dayjs'

const NoticeDetailPage = () => {
  const { noticeId } = useParams()
  const navigate = useNavigate()
  const { mutate: deleteNotice } = useDeleteNotice()

  const { data: noticeDetail, isPending } = useGetNoticeDetail(Number(noticeId))

  // 행 기준 테이블 데이터
  const dataSource = [
    {
      key: '1',
      label: '공지사항 분류',
      content: noticeDetail?.noticeTypeId === 1 ? '공지사항' : noticeDetail?.noticeTypeId === 2 ? '업데이트' : '이벤트',
    },
    {
      key: '2',
      label: '제목',
      content: noticeDetail?.noticeTitle || '로딩 중...',
    },
    {
      key: '3',
      label: '내용',
      content: noticeDetail?.noticeContent || '로딩 중...',
    },
    {
      key: '4',
      label: '등록일자',
      content: dayjs(noticeDetail?.noticeCreatedAt).format('YY-MM-DD HH:mm') || '로딩 중...',
    },
  ]

  interface TableItem {
    key: string
    label: string
    content: string
  }

  const columns: ColumnsType<TableItem> = [
    {
      title: '구분',
      dataIndex: 'label',
      key: 'label',
      width: '10%',
      align: 'center',
    },
    {
      title: '내용',
      dataIndex: 'content',
      key: 'content',
      width: '80%',
      align: 'left',
      render: (content, record) => {
        if (record.label === '내용') {
          return (
            <div className={styles.customContent}>
              <Viewer initialValue={content} key={`notice-viewer-${noticeId}-${content}`} />
            </div>
          )
        }
        return content
      },
    },
  ]

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
    <div style={{ padding: 24 }}>
      <section style={{ marginBottom: 20 }}>
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
      </section>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size='middle'
        showHeader={false}
        className={styles.noticeDetailTable}
        bordered
      />
      <div className={styles.noticeDetail__footer}>
        <Button onClick={handleBack}>목록으로</Button>
      </div>
    </div>
  )
}

export default NoticeDetailPage
