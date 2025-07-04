import { Button, ConfigProvider, Tabs, TabsProps } from 'antd'
import { COLOR } from '@/styles/abstracts/color'
import MemberList from '../memberList/MemberList'
import styles from './memberPage.module.scss'

const onChange = (key: string) => {
  console.log(key)
}

const items: TabsProps['items'] = [
  {
    key: 'total',
    label: '전체',
    children: <MemberList />,
  },
  {
    key: 'active',
    label: '사용중인 계정',
    children: <MemberList />,
  },
  {
    key: 'inactive',
    label: '정지된 계정',
    children: <MemberList />,
  },
]

const MemberPage = () => {
  return (
    <div className={styles['member-page']}>
      <Button className={styles['member-page__button']}>엑셀 다운로드</Button>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLOR.GREEN_01,
          },
        }}
      >
        <Tabs defaultActiveKey='total' items={items} onChange={onChange} />
      </ConfigProvider>
    </div>
  )
}

export default MemberPage
