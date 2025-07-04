import { Button, ConfigProvider, Tabs, TabsProps } from 'antd'
import styles from './adminManagementPage.module.scss'
import ManagerList from '../managerList/ManagerList'
import { COLOR } from '@/styles/abstracts/color'
import { useNavigate } from 'react-router-dom'

const onChange = (key: string) => {
  console.log(key)
}

const items: TabsProps['items'] = [
  {
    key: 'total',
    label: '전체',
    children: <ManagerList type='total' />,
  },
  {
    key: 'admin-manager',
    label: '통합 관리자',
    children: <ManagerList type='admin-manager' />,
  },
  {
    key: 'cs-manager',
    label: 'CS 관리자',
    children: <ManagerList type='cs-manager' />,
  },
]

const AdminManagementPage = () => {
  const navigate = useNavigate()
  return (
    <div className={styles['admin-management-page']}>
      <Button className={styles['manager-list-container__button']}>신규 계정 등록</Button>
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

export default AdminManagementPage
