import React from 'react'
import { menuItemsWithPermissions } from '@/constants/menu'
import { Menu, MenuProps } from 'antd'
import styles from './sidebar.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'

interface SidebarProps {
  collapsed?: boolean
  isTablet?: boolean
  subMenuIds?: number[]
  selectedKeys?: string[]
}

const SidebarHeader = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // 로컬스토리지와 세션스토리지 초기화
    localStorage.clear()
    sessionStorage.clear()

    // 로그인 페이지로 리다이렉트
    navigate(ROUTE_PATH.LOGIN)
  }

  return (
    <div className={styles['sidebar-header']}>
      <div className={styles['header-title']}>올바로 2.0</div>
      <div className={styles['header-subtitle']}>통합관리자</div>
      <div className={styles['header-actions']}>
        <button className={styles['logout-btn']} onClick={handleLogout}>
          [로그아웃]
        </button>
        <a href='https://v2.allbarlaw.com/' target='_blank' rel='noopener noreferrer' className={styles['home-link']}>
          홈페이지 바로가기
        </a>
      </div>
    </div>
  )
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, isTablet = false, subMenuIds = [], selectedKeys = [] }) => {
  const navigate = useNavigate()

  // 디버그: selectedKeys 확인
  console.log('🔍 Sidebar selectedKeys:', selectedKeys)

  const onClick: MenuProps['onClick'] = e => {
    console.log('🔍 Menu clicked:', e.key)
    navigate(e.key)
  }

  // 권한에 따라 메뉴 아이템 필터링
  const filterMenuItems = (items: any[]): any[] => {
    return items
      .map(item => {
        if (item.children) {
          const filteredChildren = item.children
            .filter((child: any) => {
              // 서브메뉴가 권한 ID를 가지고 있는지 확인
              return subMenuIds.includes(child.permissionId)
            })
            .map((child: any) => {
              // permissionId를 제거하고 key의 앞 슬래시도 제거
              const { permissionId, ...rest } = child
              // key에서 앞의 / 제거
              const normalizedKey = rest.key.startsWith('/') ? rest.key.slice(1) : rest.key
              return {
                ...rest,
                key: normalizedKey
              }
            })

          if (filteredChildren.length > 0) {
            return {
              ...item,
              children: filteredChildren,
            }
          }
          return null
        }
        return item
      })
      .filter(Boolean)
  }

  const filteredMenuItems = filterMenuItems(menuItemsWithPermissions)
  const alwaysOpenKeys = ['admin', 'category', 'member', 'lawyer', 'content', 'chat', 'board', 'ad', 'statistics']

  // 디버그: 필터링된 메뉴 아이템 확인
  console.log('🔍 Filtered menu items:', filteredMenuItems)

  return (
    <div
      className={`${styles.sidebar} ${collapsed && isTablet ? styles.collapsed : ''} ${isTablet ? styles.tablet : ''}`}
    >
      <SidebarHeader />
      <Menu
        onClick={onClick}
        mode='inline'
        items={filteredMenuItems}
        openKeys={alwaysOpenKeys}
        selectedKeys={selectedKeys}
        onOpenChange={() => {}}
      />
    </div>
  )
}

export default Sidebar
