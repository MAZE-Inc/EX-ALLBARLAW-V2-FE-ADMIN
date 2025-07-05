import { Button, ConfigProvider, Tabs, TabsProps } from 'antd'
import { COLOR } from '@/styles/abstracts/color'
import MemberList from '../memberList/MemberList'
import styles from './memberPage.module.scss'
import { Pagination } from '@/components/pagination'
import { useGetTotalMemberPage } from '@/hooks/queries/useGetTotalMemberPage'
import { useState } from 'react'
import { useGetMemberList } from '@/hooks/queries/useGetMemberList'

const MemberPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<'total' | 'active' | 'inactive'>('total')

  const { data: totalPages } = useGetTotalMemberPage()
  const { data: memberList, isLoading } = useGetMemberList({
    userPage: currentPage,
    orderBy: 'createdAt',
    userIsActive: activeTab === 'total' ? 'all' : activeTab,
  })

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'total' | 'active' | 'inactive')
    setCurrentPage(1) // 탭 변경 시 페이지 초기화
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
      <MemberList data={memberList || []} loading={isLoading} />
      {totalPages?.totalPages && (
        <div className={styles['pagination-wrapper']}>
          <Pagination currentPage={currentPage} totalPages={totalPages.totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}

export default MemberPage
