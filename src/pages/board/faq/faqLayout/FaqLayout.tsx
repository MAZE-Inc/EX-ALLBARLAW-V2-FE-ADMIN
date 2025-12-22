import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import styles from './faqLayout.module.scss'
import { MockupFaqMenuItems } from '@/constants/board'
import { useReadFaqCount } from '@/hooks/queries/useFaq'

export const FAQ_HEADER_PORTAL_ID = 'faq-header-portal'

const FaqLayout = () => {
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(null)
  const [_searchValue, setSearchValue] = useState('')
  const { data: faqCount } = useReadFaqCount()

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  return (
    <div className={styles.faqListPage}>
      <SearchHeader
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        placeholder='분류 선택'
        searchPlaceholder='검색어를 입력하세요'
        onSearch={handleSearch}
        menuItems={MockupFaqMenuItems}
        bordered={false}
        title={`전체 : ${faqCount?.total}개가 등록되어 있습니다.`}
        className={styles.faqListPage__searchHeader}
      />
      <header className={styles.faqListPage__header}>
        <div id={FAQ_HEADER_PORTAL_ID} />
      </header>
      <Outlet />
    </div>
  )
}

export default FaqLayout
