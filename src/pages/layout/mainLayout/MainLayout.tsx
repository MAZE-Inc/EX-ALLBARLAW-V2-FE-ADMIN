import Sidebar from '@/components/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import styles from '@/pages/layout/mainLayout/main-layout.module.scss'

const MainLayout = () => {
  return (
    <div className={styles['main-layout']}>
      <Sidebar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
