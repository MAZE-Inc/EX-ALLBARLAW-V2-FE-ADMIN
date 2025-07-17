import React, { useState } from 'react'
import { Button, Input, Modal, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import styles from './faqList.module.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { useCreateFaqType, useReadFaq, useReadFaqCount, useReadFaqType } from '@/hooks/queries/useFaq'
import { Faq } from '@/types/boardTypes'
import { Pagination } from '@/components/pagination'

const QuestionTitle = () => <div style={{ textAlign: 'center' }}>질문</div>

const FaqListPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [categoryInput, setCategoryInput] = useState('')
  const { getTypeName } = useReadFaqType()

  // URL에서 페이지 정보 가져오기 (기본값: 1)
  const currentPage = Number(searchParams.get('page')) || 1

  const { data: faqList, isLoading } = useReadFaq(currentPage)
  const { mutate: createFaqType } = useCreateFaqType()
  const { data: faqCount } = useReadFaqCount()

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setCategoryInput('')
  }

  const handleCategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => setCategoryInput(e.target.value)

  const handleSubmit = () => {
    if (categoryInput.trim()) {
      createFaqType(categoryInput)
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

  // 실제 API 데이터를 테이블 형식으로 변환
  const dataSource =
    faqList?.map((faq: Faq) => ({
      key: String(faq.faqId),
      id: faq.faqId,
      category: getTypeName(faq.faqTypeId),
      question: faq.faqTitle,
    })) || []

  const columns: ColumnsType<{ key: string; id: number; category: string; question: string }> = [
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
        loading={isLoading}
        onRow={record => ({
          onClick: () =>
            navigate(`${ROUTE_PATH.BOARD_FAQ}/${record.id}`, {
              state: { fromPage: currentPage },
            }),
        })}
      />
      <Pagination
        className={styles.faqListPage__pagination}
        totalPages={Math.ceil((faqCount?.total || 0) / (faqList?.size || 10))}
        currentPage={currentPage}
        onPageChange={handlePageChange}
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
