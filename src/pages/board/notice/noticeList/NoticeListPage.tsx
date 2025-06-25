import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchHeader, { SearchHeaderMenuItemType } from '../../../../components/searchHeader/SearchHeader'
import styles from './notice-list-page.module.scss'
import { noticeMenuItems } from '@/constants/notice'
import { ROUTE_PATH } from '@/routes/routePath'

const NoticeListPage = () => {
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(null)
  const [_searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handleNavigateToNoticeWrite = () => navigate(ROUTE_PATH.BOARD_NOTICE_EDIT)

  return (
    <div className={styles.noticeListPage}>
      <SearchHeader
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        placeholder='분류 선택'
        searchPlaceholder='검색어를 입력하세요'
        buttonText='공지 등록하기'
        onButtonClick={handleNavigateToNoticeWrite}
        onSearch={handleSearch}
        menuItems={noticeMenuItems}
        className={styles.noticeListPage__searchHeader}
      />
    </div>
  )
}

export default NoticeListPage
