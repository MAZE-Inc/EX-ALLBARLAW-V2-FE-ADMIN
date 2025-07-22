import { Button, ConfigProvider, Tabs, TabsProps } from 'antd'
import styles from './lawyerMember.module.scss'
import { COLOR } from '@/styles/abstracts/color'

const LawyerMemberPage = () => {
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
    </div>
  )
}

export default LawyerMemberPage
