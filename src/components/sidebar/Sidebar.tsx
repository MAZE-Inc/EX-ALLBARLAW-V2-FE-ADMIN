import { menuItems } from '@/constants/menu'
import { Menu, MenuProps } from 'antd'
import styles from './sidebar.module.scss'
import { useNavigate } from 'react-router-dom'

const SidebarHeader = () => {
  const handleLogout = () => {
    console.log('로그아웃 클릭')
  }

  return (
    <div className={styles['sidebar-header']}>
      <div className={styles['header-title']}>올바로 2.0</div>
      <div className={styles['header-subtitle']}>통합관리자</div>
      <div className={styles['header-actions']}>
        <button className={styles['logout-btn']} onClick={handleLogout}>
          [로그아웃]
        </button>
        <a href='https://allbarlaw.com' target='_blank' rel='noopener noreferrer' className={styles['home-link']}>
          홈페이지 바로가기
        </a>
      </div>
    </div>
  )
}

const Sidebar = () => {
  const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = e => {
    navigate(e.key)
  }

  const alwaysOpenKeys = ['admin', 'category', 'member', 'lawyer', 'content', 'chat', 'board', 'ad', 'statistics']

  return (
    <div className={styles.sidebar}>
      <SidebarHeader />
      <Menu onClick={onClick} mode='inline' items={menuItems} openKeys={alwaysOpenKeys} onOpenChange={() => {}} />
    </div>
  )
}

export default Sidebar
