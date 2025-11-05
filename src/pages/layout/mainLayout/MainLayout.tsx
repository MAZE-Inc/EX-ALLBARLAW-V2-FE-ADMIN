import { useState, useEffect, useMemo } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/header/Header'
import styles from '@/pages/layout/mainLayout/main-layout.module.scss'
import { useAdminProfile } from '@/hooks/queries/useAdmin'
import { AdminSubMenu } from '@/types/adminTypes'
import { menuItemsWithPermissions } from '@/constants/menu'

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1280)
  const location = useLocation()

  const { data: adminProfile } = useAdminProfile()
  const subMenuIds = adminProfile?.adminSubMenus?.map((subMenu: AdminSubMenu) => subMenu.subMenuId) || []
  console.log(subMenuIds)

  // 현재 경로를 기반으로 선택된 메뉴 키 계산
  const selectedKeys = useMemo(() => {
    const pathname = location.pathname
    // pathname에서 앞의 / 제거 (normalize)
    const normalizedPath = pathname.startsWith('/') ? pathname.slice(1) : pathname

    console.log('🔍 Current pathname:', pathname)
    console.log('🔍 Normalized path:', normalizedPath)

    // 모든 메뉴 아이템의 key를 추출
    const allKeys: string[] = []
    menuItemsWithPermissions.forEach((item: any) => {
      if (item.children) {
        item.children.forEach((child: any) => {
          // key 값도 normalize (앞의 / 제거)
          const normalizedKey = child.key.startsWith('/') ? child.key.slice(1) : child.key
          allKeys.push(normalizedKey)
        })
      }
    })

    console.log('🔍 All menu keys:', allKeys)

    // 1. 정확히 일치하는 key 찾기
    if (allKeys.includes(normalizedPath)) {
      console.log('🔍 Exact match found:', normalizedPath)
      return [normalizedPath]
    }

    // 2. 부분 일치하는 key 찾기 (가장 긴 것부터)
    // 예: admin-management/register/123 → admin-management/register
    const matchingKeys = allKeys.filter(key => normalizedPath.startsWith(key))
    if (matchingKeys.length > 0) {
      // 가장 긴 key 선택 (더 구체적인 경로)
      const longestKey = matchingKeys.reduce((a, b) => (a.length > b.length ? a : b))
      console.log('🔍 Partial match found:', longestKey)
      return [longestKey]
    }

    console.log('🔍 No match found, returning empty array')
    return []
  }, [location.pathname])

  useEffect(() => {
    const handleResize = () => {
      const newIsTablet = window.innerWidth <= 1280
      setIsTablet(newIsTablet)

      if (!newIsTablet) {
        setCollapsed(false)
      } else {
        setCollapsed(true)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div className={styles['main-layout']}>
      <Sidebar collapsed={isTablet && collapsed} isTablet={isTablet} subMenuIds={subMenuIds} selectedKeys={selectedKeys} />
      <div className={styles.content}>
        {isTablet && <Header onToggle={toggleSidebar} collapsed={collapsed} />}
        <Outlet />
      </div>
      {isTablet && !collapsed && <div className={styles.overlay} onClick={() => setCollapsed(true)} />}
    </div>
  )
}

export default MainLayout
