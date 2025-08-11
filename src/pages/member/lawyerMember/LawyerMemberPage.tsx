import { Button, ConfigProvider, Tabs, TabsProps } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import styles from './lawyerMember.module.scss'
import { COLOR } from '@/styles/abstracts/color'
import LawyerMemberList, { type LawyerMember } from '@/container/member/lawyerMemberList/LawyerMemberList'
import { useState } from 'react'
import { useLawyerInfoList } from '@/hooks/queries/useMember'
import { Pagination } from '@/components/pagination'
import { useExcelExport } from '@/hooks/useExcelExport'

const LawyerMemberPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'approved' | 'pending'>('all')
  const [orderBy, setOrderBy] = useState<
    | 'name'
    | 'createdAt'
    | 'blogCaseCount'
    | 'videoCaseCount'
    | 'chatRoomCount'
    | 'totalVisitCount'
    | 'monthlyVisitCount'
  >('createdAt')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [selectedLawyers, setSelectedLawyers] = useState<LawyerMember[]>([])
  
  const { exportData } = useExcelExport()

  // 실제 데이터 조회
  const { data, isLoading } = useLawyerInfoList({
    lawyerPage: currentPage,
    orderBy: orderBy,
    sort: sort,
    state: activeTab,
  })

  const handleSort = (field: string) => {
    const validField = field as typeof orderBy
    if (orderBy === validField) {
      setSort(sort === 'asc' ? 'desc' : 'asc')
    } else {
      setOrderBy(validField)
      setSort('asc')
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: '전체',
    },
    {
      key: 'new',
      label: '신규 가입',
    },
    {
      key: 'approved',
      label: '승인 완료',
    },
    {
      key: 'pending',
      label: '승인 대기중',
    },
  ]

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'all' | 'new' | 'approved' | 'pending')
    setCurrentPage(1) // 탭 변경 시 페이지 초기화
    setSelectedLawyers([]) // 탭 변경 시 선택 초기화
  }

  const handleSelectionChange = (selectedRows: LawyerMember[]) => {
    setSelectedLawyers(selectedRows)
  }

  const handleExcelDownload = () => {
    if (selectedLawyers.length === 0) {
      return
    }
    
    // 엑셀에 표시할 데이터 형식으로 변환
    const excelData = selectedLawyers.map(lawyer => ({
      '아이디': lawyer.lawyerAccount || `lawyer${lawyer.lawyerId}`,
      '이메일 주소': lawyer.lawyerEmail,
      '변호사 이름': lawyer.lawyerName,
      '연락처': lawyer.lawyerContact || '-',
      '소속': lawyer.lawyerLawfirmName || '-',
      '소속 연락처': lawyer.lawyerLawfirmContact,
      '출신 시험': `${lawyer.lawyerBarExamNumber}회`,
      '승인 상태': lawyer.lawyerApprovalStatus,
      '합격일자': lawyer.lawyerBarExamPassDate || '-',
      '가입일': lawyer.lawyerCreatedAt,
    }))
    
    exportData(excelData, '변호사회원목록', '변호사정보')
  }

  return (
    <div className={styles['lawyer-member']}>
      <div className={styles['lawyer-member__button-wrapper']}>
        <Button icon={<DownloadOutlined />} onClick={handleExcelDownload} disabled={selectedLawyers.length === 0}>
          선택 항목 엑셀 다운로드 ({selectedLawyers.length}건)
        </Button>
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLOR.GREEN_01,
          },
        }}
      >
        <Tabs activeKey={activeTab} items={items} onChange={handleTabChange} />
      </ConfigProvider>
      <LawyerMemberList
        data={data?.lawyerList || []}
        loading={isLoading}
        onSort={handleSort}
        currentOrderBy={orderBy}
        currentSort={sort}
        onSelectionChange={handleSelectionChange}
      />

      {/* 페이지네이션 */}
      {data && data.totalPages > 0 && (
        <div className={styles['pagination-wrapper']}>
          <Pagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}

export default LawyerMemberPage
