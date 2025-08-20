import { Outlet } from 'react-router-dom'
import styles from './adLawfirmLayout.module.scss'
import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { adminMenuItems } from '@/constants/admin'
import { useState } from 'react'
import { useLawfirmInfiniteScroll } from '@/hooks/queries/useLawfirm'

const AdLawfirmLayout = () => {
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(null)

  const { lawfirmTotal } = useLawfirmInfiniteScroll()

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  return (
    <div className={styles['admin-layout']}>
      <SearchHeader
        menuItems={adminMenuItems}
        className={styles['admin-layout__searchHeader']}
        bordered={false}
        title={`전체 : ${lawfirmTotal}개가 등록되어 있습니다.`}
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
      />
      <Outlet />
    </div>
  )
}

export default AdLawfirmLayout
