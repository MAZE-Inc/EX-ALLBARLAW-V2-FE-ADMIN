import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import styles from './lawyerLayout.module.scss'
import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ROUTE_PATH } from '@/routes/routePath'

export const LAWYER_HEADER_PORTAL_ID = 'lawyer-header-portal'

const lawyerMenuItems = [
  {
    label: '변호사명',
    key: 'lawyerName',
  },
  {
    label: '소속',
    key: 'lawfirmName',
  },
]

const LawyerLayout = () => {
  const navigation = useNavigate()

  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>({
    label: '변호사명',
    key: 'lawyerName',
  })

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => setSelectedItem(item)

  const handleSearch = (value: string) => {
    const params = new URLSearchParams()
    if (value) params.set('searchQuery', value)
    if (selectedItem?.key) params.set('searchType', String(selectedItem.key))
    navigation(`${ROUTE_PATH.LAWYER_MANAGEMENT}?${params.toString()}`)
  }

  return (
    <div className={styles['lawyer-layout']}>
      <SearchHeader
        menuItems={lawyerMenuItems}
        className={styles['admin-layout__searchHeader']}
        bordered={false}
        title='회원 관리'
        placeholder='선택'
        searchPlaceholder='검색어를 입력하세요'
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        onSearch={handleSearch}
      />
      <header className={styles['lawyer-layout__header']}>
        <div id={LAWYER_HEADER_PORTAL_ID} />
      </header>
      <Outlet />
    </div>
  )
}

export default LawyerLayout
