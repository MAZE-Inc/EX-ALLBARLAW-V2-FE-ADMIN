import { useState } from 'react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import SearchHeader, { SearchHeaderMenuItemType } from '../../../../components/searchHeader/SearchHeader'
import styles from './notice-layout.module.scss'
import { useReadNoticeCount } from '@/hooks/queries/useNotice'
import { ROUTE_PATH } from '@/routes/routePath'

export const NOTICE_HEADER_PORTAL_ID = 'notice-header-portal'

const noticeMenuItems = [
  {
    label: '제목',
    key: 'notice',
  },
]

const NoticeLayout = () => {
  const navigation = useNavigate()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('searchQuery') || ''
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>({
    label: '제목',
    key: 'notice',
  })
  const { data: noticeCount } = useReadNoticeCount()

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  const handleSearch = (value: string) => navigation(`${ROUTE_PATH.BOARD_NOTICE}?searchQuery=${value}`)

  return (
    <div className={styles.noticeListPage}>
      <SearchHeader
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        placeholder='분류 선택'
        searchPlaceholder='검색어를 입력하세요'
        onSearch={handleSearch}
        menuItems={noticeMenuItems}
        bordered={false}
        title={`전체 : ${noticeCount?.total}개가 등록되어 있습니다.`}
        className={styles.noticeListPage__searchHeader}
        defaultValue={searchQuery}
      />
      <header className={styles.noticeListPage__header}>
        <div id={NOTICE_HEADER_PORTAL_ID} />
      </header>
      <Outlet />
    </div>
  )
}

export default NoticeLayout
