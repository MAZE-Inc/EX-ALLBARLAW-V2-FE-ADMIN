import { useState } from 'react'
import SearchHeader, { SearchHeaderMenuItemType } from '../../../../components/searchHeader/SearchHeader'
import styles from './notice-list-page.module.scss'
import { noticeMenuItems } from '@/constants/notice'

const NoticeListPage = () => {
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(null)

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    console.log('선택된 아이템:', item)
    setSelectedItem(item)
  }

  return (
    <div className={styles.noticeListPage}>
      <SearchHeader
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        placeholder='분류 선택'
        buttonText='공지 등록하기'
        onButtonClick={() => {
          console.log('공지 등록하기')
        }}
        menuItems={noticeMenuItems}
        className={styles.noticeListPage__searchHeader}
      />
    </div>
  )
}

export default NoticeListPage
