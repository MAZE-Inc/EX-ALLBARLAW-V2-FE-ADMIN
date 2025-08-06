import { Button, ConfigProvider, Tabs, TabsProps } from 'antd'
import { COLOR } from '@/styles/abstracts/color'
import MemberList from '../../../container/member/memberList/MemberList'
import styles from './memberPage.module.scss'
import { Pagination } from '@/components/pagination'
import { useGetTotalMemberPage } from '@/hooks/queries/useGetTotalMemberPage'
import { useState } from 'react'
import { useGetMemberList } from '@/hooks/queries/useGetMemberList'
import { MemberListRequest } from '@/types/memberType'

const MemberPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<'total' | 'active' | 'inactive'>('total')
  const [orderBy, setOrderBy] = useState<MemberListRequest['orderBy']>('createdAt')
  const [sort, setSort] = useState<MemberListRequest['sort']>('desc')

  const { data: totalPages } = useGetTotalMemberPage()
  const { data: memberList, isLoading } = useGetMemberList({
    userPage: currentPage,
    orderBy,
    userIsActive: activeTab === 'total' ? 'all' : activeTab,
    sort,
  })

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'total' | 'active' | 'inactive')
    setCurrentPage(1) // 탭 변경 시 페이지 초기화
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSort = (field: MemberListRequest['orderBy']) => {
    if (field === orderBy) {
      // 같은 필드를 클릭한 경우 정렬 방향을 토글
      setSort(sort === 'asc' ? 'desc' : 'asc')
    } else {
      // 다른 필드를 클릭한 경우 해당 필드로 변경하고 내림차순으로 시작
      setOrderBy(field)
      setSort('desc')
    }
    setCurrentPage(1) // 정렬이 변경되면 첫 페이지로 이동
  }

  const items: TabsProps['items'] = [
    {
      key: 'total',
      label: '전체',
    },
    {
      key: 'active',
      label: '사용중인 계정',
    },
    {
      key: 'inactive',
      label: '정지된 계정',
    },
  ]

  return (
    <div className={styles['member-page']}>
      <div className={styles['member-page__button-wrapper']}>
        <Button>엑셀 다운로드</Button>
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLOR.GREEN_01,
          },
        }}
      >
        <Tabs defaultActiveKey='total' items={items} onChange={handleTabChange} />
      </ConfigProvider>
      <MemberList
        data={memberList || []}
        loading={isLoading}
        onSort={handleSort}
        currentOrderBy={orderBy}
        currentSort={sort}
      />
      {totalPages?.totalPages && (
        <div className={styles['pagination-wrapper']}>
          <Pagination currentPage={currentPage} totalPages={totalPages.totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}

export default MemberPage
