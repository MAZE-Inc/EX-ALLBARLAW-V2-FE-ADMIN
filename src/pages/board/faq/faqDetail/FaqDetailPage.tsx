import { Button, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import styles from './faqDetail.module.scss'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'

const FaqDetailPage = () => {
  const navigate = useNavigate()

  const faqData = {
    id: 1,
    category: '회원가입',
    question: '회원가입은 어떻게 하나요?',
    answer:
      '회원가입은 이메일과 비밀번호를 입력하여 진행할 수 있습니다. 회원가입 페이지에서 이메일 주소와 비밀번호를 입력한 후, 이메일 인증을 완료하면 회원가입이 완료됩니다.',
  }

  // 행 기준 테이블 데이터
  const dataSource = [
    {
      key: '1',
      label: 'FAQ 분류',
      content: faqData.category,
    },
    {
      key: '2',
      label: '질문',
      content: faqData.question,
    },
    {
      key: '3',
      label: '답변',
      content: faqData.answer,
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
    navigate(`${ROUTE_PATH.BOARD_FAQ}/edit/${faqData.id}`, {
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
