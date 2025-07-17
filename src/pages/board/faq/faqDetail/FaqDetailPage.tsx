import { Button, Space, Table, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import styles from './faqDetail.module.scss'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { useDeleteFaq, useReadFaqDetail, useReadFaqType } from '@/hooks/queries/useFaq'

const FaqDetailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { faqId } = useParams()
  const { getTypeName } = useReadFaqType()
  const { data: faqData } = useReadFaqDetail(Number(faqId))
  const { mutate: deleteFaq } = useDeleteFaq()

  // 행 기준 테이블 데이터
  const dataSource = [
    {
      key: '1',
      label: 'FAQ 분류',
      content: faqData ? getTypeName(faqData.faqTypeId) : '로딩 중...',
    },
    {
      key: '2',
      label: '질문',
      content: faqData?.faqTitle || '로딩 중...',
    },
    {
      key: '3',
      label: '답변',
      content: faqData?.faqContent || '로딩 중...',
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
        if (record.label === '답변') {
          return (
            <div className={styles.customAnswer}>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          )
        }
        return content
      },
    },
  ]

  const handleBack = () => {
    // 이전 페이지 정보가 있으면 해당 페이지로, 없으면 기본 페이지로
    const fromPage = location.state?.fromPage || 1
    navigate(`${ROUTE_PATH.BOARD_FAQ}?page=${fromPage}`)
  }

  const handleEdit = () => {
    if (faqData) {
      navigate(`${ROUTE_PATH.BOARD_FAQ}/edit/${faqData.faqId}`, {
        state: { faqDetail: faqData },
      })
    }
  }

  const handleDelete = () => {
    Modal.confirm({
      title: 'FAQ 삭제',
      content: '이 FAQ를 삭제하시겠습니까?',
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: () => {
        if (faqData) {
          deleteFaq(faqData.faqId)
          navigate(ROUTE_PATH.BOARD_FAQ)
        }
      },
    })
  }

  return (
    <div style={{ padding: 24 }}>
      <section style={{ marginBottom: 20 }}>
        <div className={styles.faqDetail__actions}>
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
        className={styles.faqDetailTable}
      />
      <div className={styles.faqDetail__footer}>
        <Button onClick={handleBack}>목록으로</Button>
      </div>
    </div>
  )
}

export default FaqDetailPage
