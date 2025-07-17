import React, { useState } from 'react'
import { Button, Input, Modal, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import styles from './faqList.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'

const QuestionTitle = () => <div style={{ textAlign: 'center' }}>질문</div>

const FaqListPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [categoryInput, setCategoryInput] = useState('')
  const navigate = useNavigate()

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setCategoryInput('')
  }

  const handleCategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryInput(e.target.value)
  }

  const handleSubmit = () => {
    if (categoryInput.trim()) {
      // TODO: API 호출 로직 추가
      console.log('등록할 카테고리:', categoryInput)
      setCategoryInput('')
      setIsModalVisible(false)
    }
  }

  const handleFaqRegister = () => {
    navigate(`${ROUTE_PATH.BOARD_FAQ_EDIT}`)
  }

  // 체크박스 선택 처리
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: '5%',
    columnTitle: '',
  }

  interface FaqItem {
    key: string
    id: number
    category: string
    question: string
    answer: string
  }

  // 테이블 데이터
  const dataSource: FaqItem[] = [
    {
      key: '1',
      id: 1,
      category: '회원가입',
      question: '회원가입은 어떻게 하나요?',
      answer: '회원가입은 이메일과 비밀번호를 입력하여 진행할 수 있습니다.',
    },
    {
      key: '2',
      id: 2,
      category: '로그인',
      question: '비밀번호를 잊어버렸어요',
      answer: '비밀번호 찾기 기능을 통해 이메일로 임시 비밀번호를 받을 수 있습니다.',
    },
    {
      key: '3',
      id: 3,
      category: '결제',
      question: '결제 방법은 어떤 것들이 있나요?',
      answer: '신용카드, 계좌이체, 간편결제 등 다양한 방법을 지원합니다.',
    },
  ]

  const columns: ColumnsType<FaqItem> = [
    {
      title: '',
      dataIndex: 'checkbox',
      key: 'checkbox',
      align: 'center',
    },
    {
      title: 'FAQ 분류',
      dataIndex: 'category',
      key: 'category',
      width: '30%',
      align: 'center',
    },
    {
      title: QuestionTitle,
      dataIndex: 'question',
      key: 'question',
      width: '65%',
      align: 'left',
      ellipsis: true,
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <section className={styles.faqListPage__buttonContainer}>
        <Button onClick={showModal}>FAQ 분류 등록하기</Button>
        <Button onClick={handleFaqRegister}>FAQ 등록하기</Button>
      </section>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowSelection={rowSelection}
        className={styles.faqTable}
        pagination={false}
        size='middle'
        onRow={record => ({
          onClick: () => navigate(`${ROUTE_PATH.BOARD_FAQ}/${record.id}`),
        })}
      />
      <Modal
        title='FAQ 분류 등록'
        open={isModalVisible}
        onCancel={handleCancel}
        footer={
          <>
            <Button onClick={handleCancel}>취소</Button>
            <Button
              type='primary'
              onClick={handleSubmit}
              disabled={!categoryInput.trim()}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              등록하기
            </Button>
          </>
        }
      >
        <div className={styles.faqCategoryModal}>
          <label>FAQ 분류 등록</label>
          <Input placeholder='FAQ 분류를 입력해주세요.' value={categoryInput} onChange={handleCategoryInput} />
        </div>
      </Modal>
    </div>
  )
}

export default FaqListPage
