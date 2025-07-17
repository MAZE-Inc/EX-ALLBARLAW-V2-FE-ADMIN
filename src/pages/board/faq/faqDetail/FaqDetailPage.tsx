import { Button, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import styles from './faqDetail.module.scss'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { Faq } from '@/types/boardTypes'

const FaqDetailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { faqId } = useParams()

  // 전달받은 FAQ 데이터 또는 기본값
  const faqData: Faq = location.state?.faqDetail || {
    faqId: Number(faqId),
    faqTitle: '데이터를 불러올 수 없습니다.',
    faqContent: '데이터를 불러올 수 없습니다.',
    faqTypeName: '알 수 없음',
    faqCreatedAt: '',
  }

  // 행 기준 테이블 데이터
  const dataSource = [
    {
      key: '1',
      label: 'FAQ 분류',
      content: faqData.faqTypeName,
    },
    {
      key: '2',
      label: '질문',
      content: faqData.faqTitle,
    },
    {
      key: '3',
      label: '답변',
      content: faqData.faqContent,
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
    },
  ]

  const handleBack = () => {
    navigate(ROUTE_PATH.BOARD_FAQ)
  }

  const handleEdit = () => {
    navigate(`${ROUTE_PATH.BOARD_FAQ}/edit/${faqData.faqId}`, {
      state: { faqDetail: faqData },
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
            <Button danger icon={<DeleteOutlined />}>
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
