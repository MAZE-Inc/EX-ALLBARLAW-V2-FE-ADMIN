import React, { useState, useEffect } from 'react'
import { Table, TableProps, Button, Tag, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useLegalTermReportList, useChangeLegalTermStatus } from '@/hooks/queries/useLegalTerm'
import { LegalTermReportRequest } from '@/types/legalTermTypes'
import { Pagination } from '@/components/pagination/Pagination'
import { useLegalDictionary } from '@/contexts/LegalDictionaryContext'
import { ROUTE_PATH } from '@/routes/routePath'
import styles from './legalTermErrorReportList.module.scss'

interface ErrorReportTableData {
  key: number
  id: number
  legalTermId?: number
  koreanName: string
  englishName: string
  chineseName: string
  status: 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'REJECTED'
  reportType: string
  createdAt: string
  description: string
}

const LegalTermErrorReportList = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<ErrorReportTableData[]>([])
  const [request, setRequest] = useState<LegalTermReportRequest>({
    page: 1,
  })

  const { setSelectedReports } = useLegalDictionary()
  const { data: reportData, isLoading, refetch } = useLegalTermReportList(request)

  // 상태 변경 훅
  const { mutate: changeStatus, isPending: isChangingStatus } = useChangeLegalTermStatus({
    onSuccess: () => {
      message.success('처리가 완료되었습니다.')
      refetch() // 리스트 새로고침
    },
    onError: () => {
      message.error('처리에 실패했습니다.')
    },
  })

  // 선택된 항목이 변경될 때마다 Context 업데이트
  useEffect(() => {
    setSelectedReports(selectedRows)
  }, [selectedRows, setSelectedReports])

  // API 응답 데이터를 테이블 형식으로 변환
  const tableData: ErrorReportTableData[] =
    reportData?.reports?.map(report => ({
      key: report.id,
      id: report.id,
      legalTermId: report.legalTermId,
      koreanName: report.koreanName,
      englishName: report.englishName,
      chineseName: report.chineseName,
      status: report.status,
      reportType: report.reportType,
      createdAt: report.createdAt,
      description: report.description,
    })) || []

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setRequest(prev => ({
      ...prev,
      page,
    }))
  }

  // 처리완료 버튼 클릭 핸들러
  const handleResolve = (record: ErrorReportTableData, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지

    // API 호출하여 상태를 RESOLVED로 변경
    changeStatus({
      id: record.id,
      status: 'RESOLVED',
    })
  }

  const columns: TableProps<ErrorReportTableData>['columns'] = [
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
    {
      title: '오류처리',
      key: 'status',
      width: 200,
      render: (_, record) => (
        <div className={styles['status-cell']}>
          {record.status === 'PENDING' || record.status === 'PROCESSING' ? (
            <>
              <Tag color='warning' className={styles['status-tag']}>
                오류신고
              </Tag>
              <Button
                size='small'
                onClick={e => handleResolve(record, e)}
                className={styles['resolve-btn']}
                loading={isChangingStatus}
              >
                처리완료
              </Button>
            </>
          ) : (
            <>
              <Tag color='default' className={styles['status-tag-disabled']}>
                오류신고
              </Tag>
              <Tag color='processing' className={styles['status-tag-completed']}>
                처리완료
              </Tag>
            </>
          )}
        </div>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedRows.map(row => row.id),
    onSelectAll: (selected: boolean, selectedRows: ErrorReportTableData[]) => {
      const newSelectedRows = selected ? selectedRows : []
      setSelectedRows(newSelectedRows)
    },
    onSelect: (record: ErrorReportTableData, selected: boolean) => {
      setSelectedRows(prev => {
        const newSelectedRows = selected ? [...prev, record] : prev.filter(row => row.id !== record.id)
        return newSelectedRows
      })
    },
  }

  return (
    <div className={styles['error-report-list-container']}>
      <Table<ErrorReportTableData>
        columns={columns}
        dataSource={tableData}
        rowSelection={rowSelection}
        rowKey='id'
        pagination={false}
        loading={isLoading}
        onRow={record => ({
          onClick: () => {
            // legalTermId가 있으면 해당 법률 용어 상세로 이동
            if (record.legalTermId) {
              navigate(`${ROUTE_PATH.BOARD_LEGAL_DICTIONARY}/${record.legalTermId}`)
            }
          },
        })}
      />
      {reportData?.totalPages !== undefined && reportData.totalPages > 0 && (
        <div className={styles['pagination-wrapper']}>
          <Pagination currentPage={currentPage} totalPages={reportData.totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}

export default LegalTermErrorReportList
