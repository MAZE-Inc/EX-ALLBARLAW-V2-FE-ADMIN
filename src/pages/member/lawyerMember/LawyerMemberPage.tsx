import { Button, ConfigProvider, Tabs, TabsProps } from 'antd'
import styles from './lawyerMember.module.scss'
import { COLOR } from '@/styles/abstracts/color'
import LawyerMemberList from '@/container/member/lawyerMemberList/LawyerMemberList'
import { useState } from 'react'
import { useLawyerInfoList } from '@/hooks/queries/useMember'
import { Pagination } from '@/components/pagination'

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

  // 실제 데이터 조회
  const { data, isLoading } = useLawyerInfoList({
    lawyerPage: currentPage,
    orderBy: orderBy,
    sort: sort,
    state: activeTab,
  })

  // Tab 변경 시 데이터 로깅
  console.log('Current state:', activeTab, 'Data:', data)

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
    console.log('Tab changed to:', key)
    setActiveTab(key as 'all' | 'new' | 'approved' | 'pending')
    setCurrentPage(1) // 탭 변경 시 페이지 초기화
  }

  return (
    <div className={styles['lawyer-member']}>
      <div className={styles['lawyer-member__button-wrapper']}>
        <Button>엑셀 다운로드</Button>
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
