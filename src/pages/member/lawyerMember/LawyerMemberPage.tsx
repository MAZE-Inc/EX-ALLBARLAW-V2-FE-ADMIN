import { Button, ConfigProvider, Tabs, TabsProps } from 'antd'
import styles from './lawyerMember.module.scss'
import { COLOR } from '@/styles/abstracts/color'
import LawyerMemberList from '@/container/member/lawyerMemberList/LawyerMemberList'
import { useState } from 'react'

const LawyerMemberPage = () => {
  const [orderBy, setOrderBy] = useState('account')
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')

  // 임시 데이터
  const mockData = [
    {
      lawyerId: 1,
      lawyerAccount: 'lawyer1',
      lawyerEmail: 'lawyer1@example.com',
      lawyerName: '김변호사',
      lawyerPhone: '010-1234-5678',
      lawyerOffice: '법무법인',
      lawyerOfficePhone: '02-1234-5678',
      lawyerExam: '사법시험',
      lawyerApproved: true,
      lawyerCreatedAt: '2024-01-01',
    },
  ]

  const handleSort = (field: string) => {
    if (orderBy === field) {
      setSort(sort === 'asc' ? 'desc' : 'asc')
    } else {
      setOrderBy(field)
      setSort('asc')
    }
  }

  const items: TabsProps['items'] = [
    {
      key: 'total',
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
    console.log(key)
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
        <Tabs defaultActiveKey='total' items={items} onChange={handleTabChange} />
      </ConfigProvider>
      <LawyerMemberList
        data={mockData}
        loading={false}
        onSort={handleSort}
        currentOrderBy={orderBy}
        currentSort={sort}
      />
    </div>
  )
}

export default LawyerMemberPage
