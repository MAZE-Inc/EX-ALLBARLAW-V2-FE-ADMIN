import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import styles from './faqLayout.module.scss'
import { useReadFaqCount } from '@/hooks/queries/useFaq'
import { ROUTE_PATH } from '@/routes/routePath'

export const FAQ_HEADER_PORTAL_ID = 'faq-header-portal'

const FaqMenuItems = [
  {
    label: '분류명',
    key: 'faqType',
  },
  {
    label: '질문',
    key: 'title',
  },
]

const FaqLayout = () => {
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>({
    label: '분류명',
    key: 'faqType',
  })

  const navigate = useNavigate()
  const { data: faqCount } = useReadFaqCount()

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  const handleSearch = (value: string) => {
    const params = new URLSearchParams()
    if (value) params.set('searchQuery', value)
    if (selectedItem?.key) params.set('faqSearchType', String(selectedItem.key))
    navigate(`${ROUTE_PATH.BOARD_FAQ}?${params.toString()}`)
  }

  return (
    <div className={styles.faqListPage}>
      <SearchHeader
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        placeholder='분류 선택'
        searchPlaceholder='검색어를 입력하세요'
        onSearch={handleSearch}
        menuItems={FaqMenuItems}
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
