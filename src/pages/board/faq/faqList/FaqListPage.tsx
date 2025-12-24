import React, { useEffect, useState } from 'react'
import { Button, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import styles from './faqList.module.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { useCreateFaqType, useReadFaq, useReadFaqCount, useReadFaqType } from '@/hooks/queries/useFaq'
import { Faq } from '@/types/boardTypes'
import { Pagination } from '@/components/pagination'
import InputModal from '@/components/inputModal'

type FaqSearchType = 'faqType' | 'title'

const QuestionTitle = () => <div style={{ textAlign: 'center' }}>질문</div>

const FaqListPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { getTypeName } = useReadFaqType()

  // URL에서 페이지 및 검색 정보 가져오기
  const currentPage = Number(searchParams.get('page')) || 1
  const searchQueryFromUrl = searchParams.get('searchQuery') || undefined
  const faqSearchTypeFromUrl = (searchParams.get('faqSearchType') as FaqSearchType) || undefined

  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl)
  const [faqSearchType, setFaqSearchType] = useState(faqSearchTypeFromUrl)

  // URL 파라미터가 변경되면 상태 업데이트
  useEffect(() => {
    setSearchQuery(searchQueryFromUrl)
    setFaqSearchType(faqSearchTypeFromUrl)
  }, [searchQueryFromUrl, faqSearchTypeFromUrl])

  const { data: faqList, isLoading } = useReadFaq({
    faqPage: currentPage,
    searchQuery,
    faqSearchType,
  })
  const { mutate: createFaqType } = useCreateFaqType()
  const { data: faqCount } = useReadFaqCount()

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => setSearchParams({ page: page.toString() })

  const showModal = () => setIsModalVisible(true)

  const handleCancel = () => setIsModalVisible(false)

  const handleSubmit = (categoryName: string) => {
    createFaqType(categoryName)
    setIsModalVisible(false)
  }

  const handleFaqRegister = () => navigate(`${ROUTE_PATH.BOARD_FAQ_EDIT}`)

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
      <InputModal
        title='FAQ 분류 등록'
        open={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        placeholder='FAQ 분류를 입력해주세요.'
        label='FAQ 분류 등록'
      />
    </div>
  )
}

export default FaqListPage
