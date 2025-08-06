import SearchHeader from '@/components/searchHeader/SearchHeader'
import styles from './lawyerLayout.module.scss'
import { Outlet } from 'react-router-dom'

const LawyerLayout = () => {
  return (
    <div className={styles['lawyer-layout']}>
      <SearchHeader
        // menuItems={adminMenuItems}/
        className={styles['admin-layout__searchHeader']}
        bordered={false}
        title='회원 관리'
        placeholder='선택'
        searchPlaceholder='검색어를 입력하세요'
        // selectedItem={selectedItem}
        // onSelectionChange={handleSelectionChange}
      />
      <Outlet />
    </div>
  )
}

export default LawyerLayout
