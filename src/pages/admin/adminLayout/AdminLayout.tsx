import { Outlet } from 'react-router-dom'
import styles from './adminLayout.module.scss'
import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { adminMenuItems } from '@/constants/admin'
import { useState } from 'react'

const AdminLayout = () => {
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(null)

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  return (
    <div className={styles['admin-layout']}>
      <SearchHeader
        menuItems={adminMenuItems}
        className={styles['admin-layout__searchHeader']}
        bordered={false}
        title='관리자 계정 관리'
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
      />
      <Outlet />
    </div>
  )
}

export default AdminLayout
