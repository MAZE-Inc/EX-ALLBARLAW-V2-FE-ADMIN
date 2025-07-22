import SearchHeader from '@/components/searchHeader/SearchHeader'
import styles from './lawyerMemberLayout.module.scss'
import { Outlet } from 'react-router-dom'

const LawyerMemberLayout = () => {
  return (
    <div>
      <div className={styles['admin-layout']}>
        <SearchHeader className={styles['admin-layout__searchHeader']} bordered={false} title='' placeholder='선택' />
        <Outlet />
      </div>
    </div>
  )
}

export default LawyerMemberLayout
