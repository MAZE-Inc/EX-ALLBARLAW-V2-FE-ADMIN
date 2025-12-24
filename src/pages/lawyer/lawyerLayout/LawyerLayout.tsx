import SearchHeader from '@/components/searchHeader/SearchHeader'
import styles from './lawyerLayout.module.scss'
import { Outlet } from 'react-router-dom'

export const LAWYER_HEADER_PORTAL_ID = 'lawyer-header-portal'

const lawyerMenuItems = [
  {
    label: '변호사명',
    key: 'lawyerName',
  },
  {
    label: '소속',
    key: 'lawyerGrade',
  },
]

const LawyerLayout = () => {
  return (
    <div className={styles['lawyer-layout']}>
      <SearchHeader
        menuItems={lawyerMenuItems}
        className={styles['admin-layout__searchHeader']}
        bordered={false}
        title='회원 관리'
        placeholder='선택'
        searchPlaceholder='검색어를 입력하세요'
        // selectedItem={selectedItem}
        // onSelectionChange={handleSelectionChange}
      />
      <header className={styles['lawyer-layout__header']}>
        <div id={LAWYER_HEADER_PORTAL_ID} />
      </header>
      <Outlet />
    </div>
  )
}

export default LawyerLayout
