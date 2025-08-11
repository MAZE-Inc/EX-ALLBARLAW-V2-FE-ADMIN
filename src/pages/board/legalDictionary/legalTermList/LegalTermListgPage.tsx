import { useState, useEffect } from 'react'
import { Table, TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useLegalTermList } from '@/hooks/queries/useLegalTerm'
import { LegalTermListRequest } from '@/types/legalTermTypes'
import { Pagination } from '@/components/pagination/Pagination'
import { useLegalDictionary } from '@/contexts/LegalDictionaryContext'
import { ROUTE_PATH } from '@/routes/routePath'
import styles from './legalTermList.module.scss'

interface LegalTermTableData {
  key: number
  id: number
  koreanName: string
  englishName: string
  chineseName: string
}

const LegalTermListPage = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<LegalTermTableData[]>([])
  const [request, setRequest] = useState<LegalTermListRequest>({
    page: 1,
  })
  
  const { setSelectedLegalTerms } = useLegalDictionary()
  const { data: legalTermData, isLoading } = useLegalTermList(request)
  
  // 선택된 항목이 변경될 때마다 Context 업데이트
  useEffect(() => {
    setSelectedLegalTerms(selectedRows)
  }, [selectedRows, setSelectedLegalTerms])

  // API 응답 데이터를 테이블 형식으로 변환
  const tableData: LegalTermTableData[] = 
    legalTermData?.legalTerms?.map(term => ({
      key: term.id,
      id: term.id,
      koreanName: term.koreanName,
      englishName: term.englishName,
      chineseName: term.chineseName,
    })) || []

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setRequest(prev => ({
      ...prev,
      page,
    }))
  }
  
  const columns: TableProps<LegalTermTableData>['columns'] = [
    {
      title: '한글 용어명',
      dataIndex: 'koreanName',
      key: 'koreanName',
    },
    {
      title: '영문 용어명',
      dataIndex: 'englishName',
      key: 'englishName',
    },
    {
      title: '한문 용어명',
      dataIndex: 'chineseName',
      key: 'chineseName',
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedRows.map(row => row.id),
    onSelectAll: (selected: boolean, selectedRows: LegalTermTableData[]) => {
      const newSelectedRows = selected ? selectedRows : []
      setSelectedRows(newSelectedRows)
    },
    onSelect: (record: LegalTermTableData, selected: boolean) => {
      setSelectedRows(prev => {
        const newSelectedRows = selected 
          ? [...prev, record] 
          : prev.filter(row => row.id !== record.id)
        return newSelectedRows
      })
    },
  }

  return (
    <div className={styles['legal-term-list-container']}>
      <Table<LegalTermTableData>
        columns={columns}
        dataSource={tableData}
        rowSelection={rowSelection}
        rowKey='id'
        pagination={false}
        loading={isLoading}
        onRow={record => ({
          onClick: () => {
            navigate(`${ROUTE_PATH.BOARD_LEGAL_DICTIONARY}/${record.id}`)
          },
        })}
      />
      {legalTermData?.totalPages && (
        <div className={styles['pagination-wrapper']}>
          <Pagination
            currentPage={currentPage}
            totalPages={legalTermData.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default LegalTermListPage