import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import SearchHeader, { SearchHeaderMenuItemType } from '../../../components/searchHeader/SearchHeader'
import styles from './notice-layout.module.scss'
import { ROUTE_PATH } from '@/routes/routePath'
import { noticeMenuItems } from '@/constants/notice'

const NoticeLayout = () => {
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(null)
  const [_searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()
  const noticeCount = 10

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
        onSearch={handleSearch}
        menuItems={noticeMenuItems}
        title={`전체 : ${noticeCount}개가 등록되어 있습니다.`}
        buttonComponent={
          <Button className={styles.noticeListPage__searchHeader__button} onClick={handleNavigateToNoticeWrite}>
            공지 등록하기
          </Button>
        }
        className={styles.noticeListPage__searchHeader}
      />
      <Outlet />
    </div>
  )
}

export default NoticeLayout
