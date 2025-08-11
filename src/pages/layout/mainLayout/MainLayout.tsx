import { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import Header from '@/components/header/Header'
import styles from '@/pages/layout/mainLayout/main-layout.module.scss'
import { useAdminProfile } from '@/hooks/queries/useAdmin'
import { AdminSubMenu } from '@/types/adminTypes'

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 768)

  const { data: adminProfile } = useAdminProfile()
  const subMenuIds = adminProfile?.adminSubMenus?.map((subMenu: AdminSubMenu) => subMenu.subMenuId) || []
  console.log(subMenuIds)

  useEffect(() => {
    const handleResize = () => {
      const newIsTablet = window.innerWidth <= 768
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
      <Sidebar collapsed={isTablet && collapsed} isTablet={isTablet} />
      <div className={styles.content}>
        {isTablet && <Header onToggle={toggleSidebar} collapsed={collapsed} />}
        <Outlet />
      </div>
      {isTablet && !collapsed && <div className={styles.overlay} onClick={() => setCollapsed(true)} />}
    </div>
  )
}

export default MainLayout
