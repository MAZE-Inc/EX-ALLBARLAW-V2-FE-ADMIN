import { menuItems } from '@/constants/menu'
import { Menu, MenuProps } from 'antd'
import styles from './sidebar.module.scss'
// import { useNavigate } from 'react-router-dom'

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
  //   const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = e => {
    console.log('메뉴 클릭:', e.key)
    // 나중에 라우팅 로직 추가
  }

  // 항상 열린 상태로 유지할 서브메뉴 키들
  const alwaysOpenKeys = ['admin', 'category', 'member', 'lawyer', 'content', 'chat', 'board', 'ad', 'statistics']

  // 메뉴 열림/닫힘 시도를 막음
  const handleOpenChange = () => {
    // 아무것도 하지 않음 - 항상 열린 상태 유지
  }

  return (
    <div className={styles.sidebar}>
      <SidebarHeader />
      <Menu
        onClick={onClick}
        mode='inline'
        items={menuItems}
        openKeys={alwaysOpenKeys}
        onOpenChange={handleOpenChange}
      />
    </div>
  )
}

export default Sidebar
