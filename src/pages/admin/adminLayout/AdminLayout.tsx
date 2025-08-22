import { Outlet } from 'react-router-dom'
import styles from './adminLayout.module.scss'
import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'

import { useState } from 'react'

const adminMenuItems = [
  { label: '아이디', key: 'name' },
  { label: '이메일주소', key: 'email' },
  { label: '계정이름', key: 'name' },
]

const AdminLayout = () => {
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(null)

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  const onSearch = (value: string) => {
    console.log(value)
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
        onSearch={onSearch}
      />
      <Outlet />
    </div>
  )
}

export default AdminLayout
