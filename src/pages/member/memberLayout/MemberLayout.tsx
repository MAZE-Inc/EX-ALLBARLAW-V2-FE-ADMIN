import { Outlet } from 'react-router-dom'
import styles from './memberLayout.module.scss'
import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { adminMenuItems } from '@/constants/admin'
import { useState } from 'react'

const MemberLayout = () => {
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
        title='회원 관리'
        placeholder='선택'
        searchPlaceholder='검색어를 입력하세요'
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
      />
      <Outlet />
    </div>
  )
}

export default MemberLayout
