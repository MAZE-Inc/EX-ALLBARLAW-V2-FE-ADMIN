import { Button, ConfigProvider, Tabs, TabsProps } from 'antd'
import { COLOR } from '@/styles/abstracts/color'
import MemberList from '../memberList/MemberList'
import styles from './memberPage.module.scss'
import { Pagination } from '@/components/pagination'
import { useGetTotalMemberPage } from '@/hooks/queries/useGetTotalMemberPage'
import { useState } from 'react'
import { useGetMemberList } from '@/hooks/queries/useGetMemberList'

const MemberPage = () => {
  const { data } = useGetTotalMemberPage()
  const [_activeTab, setActiveTab] = useState<string>('total')
  const { data: memberList } = useGetMemberList({
    userPage: 1,
    orderBy: 'account',
    userIsActive: 'all',
  })

  console.log(memberList)

  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }

  const items: TabsProps['items'] = [
    {
      key: 'total',
      label: '전체',
      children: <MemberList type='total' />,
    },
    {
      key: 'active',
      label: '사용중인 계정',
      children: <MemberList type='active' />,
    },
    {
      key: 'inactive',
      label: '정지된 계정',
      children: <MemberList type='inactive' />,
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
      {data?.totalPages && (
        <div className={styles['pagination-wrapper']}>
          <Pagination totalPages={data.totalPages} onPageChange={() => {}} />
        </div>
      )}
    </div>
  )
}

export default MemberPage
